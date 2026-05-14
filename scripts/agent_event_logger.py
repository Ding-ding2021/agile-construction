#!/usr/bin/env python3
"""Agent 行为审计 — JSONL 行为事件日志"""

import json
from datetime import datetime, date, timedelta
from collections import defaultdict
from pathlib import Path
from typing import Optional

EVENTS_DIR = Path("memory/events")
VALID_EVENTS = {
    "SKILL_CALL", "SKILL_MISS", "DOC_READ", "DOC_SKIP",
    "IRON_RULE_BREAK", "CLARIFY_ASK",
    "BOUNDARY_VIOLATE", "YES_MAN", "ROLE_DUTY_DONE",
}
REQUIRED_FIELDS = {
    "SKILL_CALL": ["agent", "skill", "context"],
    "SKILL_MISS": ["agent", "should_have", "context"],
    "DOC_READ": ["agent", "doc", "reason"],
    "DOC_SKIP": ["agent", "should_have", "reason"],
    "IRON_RULE_BREAK": ["agent", "rule", "desc"],
    "CLARIFY_ASK": ["agent", "topic", "ambiguity"],
    "BOUNDARY_VIOLATE": ["agent", "violation"],
    "YES_MAN": ["agent", "context", "should_oppose"],
    "ROLE_DUTY_DONE": ["agent", "duty"],
}


def today_str() -> str:
    return date.today().isoformat()


def now_iso() -> str:
    return datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")


def _event_path(d: str = None) -> Path:
    d = d or today_str()
    EVENTS_DIR.mkdir(parents=True, exist_ok=True)
    return EVENTS_DIR / f"{d}.jsonl"


def validate_event(event: dict) -> Optional[str]:
    event_type = event.get("event")
    if not event_type:
        return "missing 'event' field"
    if event_type not in VALID_EVENTS:
        return f"unknown event type: {event_type}"
    for field in REQUIRED_FIELDS.get(event_type, []):
        if field not in event or event[field] is None:
            return f"missing required field '{field}' for event '{event_type}'"
    return None


def log_event(event: dict, d: str = None) -> bool:
    event.setdefault("timestamp", now_iso())
    err = validate_event(event)
    if err:
        print(f"[agent-event] INVALID: {err} — {json.dumps(event)}")
        return False
    path = _event_path(d)
    with open(path, "a") as f:
        f.write(json.dumps(event, ensure_ascii=False) + "\n")
    print(f"[agent-event] LOGGED: {event['event']} by {event.get('agent', '?')}")
    return True


def load_events(d: str = None) -> list[dict]:
    path = _event_path(d)
    if not path.exists():
        return []
    events = []
    with open(path) as f:
        for line in f:
            line = line.strip()
            if line:
                events.append(json.loads(line))
    return events


def load_events_range(start: str, end: str) -> list[dict]:
    all_events = []
    p = EVENTS_DIR
    if not p.exists():
        return []
    for f in sorted(p.glob("*.jsonl")):
        f_date = f.stem
        if start <= f_date <= end:
            with open(f) as fh:
                for line in fh:
                    line = line.strip()
                    if line:
                        all_events.append(json.loads(line))
    return all_events


def aggregate_by_agent(events: list[dict]) -> dict:
    agg = defaultdict(lambda: defaultdict(int))
    for e in events:
        agent = e.get("agent", "unknown")
        agg[agent][e["event"]] += 1
    return dict(agg)


# === 评估报告生成 ===

DIMS = ["铁律遵守", "工具准确", "文档使用", "角色尽职"]
DIM_EVENTS = {
    "铁律遵守": ["IRON_RULE_BREAK", "CLARIFY_ASK"],
    "工具准确": ["SKILL_CALL", "SKILL_MISS"],
    "文档使用": ["DOC_READ", "DOC_SKIP"],
    "角色尽职": ["BOUNDARY_VIOLATE", "YES_MAN", "ROLE_DUTY_DONE"],
}
NEGATIVE_EVENTS = {"IRON_RULE_BREAK", "SKILL_MISS", "DOC_SKIP", "BOUNDARY_VIOLATE", "YES_MAN"}
OBJECTIVE_EVENTS = {"SKILL_CALL", "DOC_READ", "ROLE_DUTY_DONE"}
AGENT_SHORT = {"陈锋": "陈锋(开)", "苏染": "苏染(设)", "周严": "周严(测)", "林墨": "林墨(产)"}


def compute_dimension_scores(events: list[dict]) -> dict:
    by_agent = defaultdict(list)
    for e in events:
        by_agent[e.get("agent", "unknown")].append(e)

    scores = {}
    for agent, agent_events in by_agent.items():
        s = {}
        total_tasks = max(1, len(set(e.get("context", "") for e in agent_events)))

        calls = sum(1 for e in agent_events if e["event"] == "SKILL_CALL")
        misses = sum(1 for e in agent_events if e["event"] == "SKILL_MISS")
        s["工具准确"] = round(calls / (calls + misses) * 100, 1) if (calls + misses) > 0 else None

        reads = sum(1 for e in agent_events if e["event"] == "DOC_READ")
        skips = sum(1 for e in agent_events if e["event"] == "DOC_SKIP")
        s["文档使用"] = round(reads / (reads + skips) * 100, 1) if (reads + skips) > 0 else None

        rule_breaks = [e for e in agent_events if e["event"] == "IRON_RULE_BREAK"]
        rule1 = sum(1 for e in rule_breaks if e.get("rule") == 1)
        rule2 = sum(1 for e in rule_breaks if e.get("rule") == 2)
        rule3 = sum(1 for e in rule_breaks if e.get("rule") == 3)
        iron_score = (1 - rule1 / total_tasks) * (1 - rule2 / total_tasks) * (1 - rule3 / total_tasks)
        s["铁律遵守"] = round(iron_score * 100, 1)

        duties = sum(1 for e in agent_events if e["event"] == "ROLE_DUTY_DONE")
        boundary_violations = sum(1 for e in agent_events if e["event"] == "BOUNDARY_VIOLATE")
        yes_man = sum(1 for e in agent_events if e["event"] == "YES_MAN")
        duty_score = duties / max(1, duties + boundary_violations + yes_man) * 40
        boundary_score = (1 - boundary_violations / max(1, total_tasks)) * 40
        independence = 20 if yes_man == 0 else round((1 - yes_man / max(1, yes_man + 1)) * 20, 1)
        s["角色尽职"] = round(duty_score + boundary_score + independence, 1)

        scores[agent] = s
    return scores


def score_to_icon(score: float) -> str:
    if score is None:
        return "—"
    return "🟢" if score >= 80 else "🟡" if score >= 50 else "🔴"


def generate_report(start: str, end: str) -> str:
    events = load_events_range(start, end)
    scores = compute_dimension_scores(events)

    lines = [f"# Agent 行为审计周报", f"## 周期：{start} ~ {end}", ""]
    lines.append("| Agent | " + " | ".join(DIMS) + " | 综合 |")
    lines.append("|" + "|".join(["---"] * (len(DIMS) + 2)) + "|")

    overall = {}
    for agent, ds in sorted(scores.items()):
        vals = []
        for d in DIMS:
            v = ds.get(d)
            vals.append(f"{score_to_icon(v)} {v}" if v is not None else "— —")
        name = AGENT_SHORT.get(agent, agent)
        valid = [ds[d] for d in DIMS if ds.get(d) is not None]
        overall[agent] = round(sum(valid) / len(valid), 1) if valid else None
        ov = overall[agent]
        lines.append(f"| {name} | " + " | ".join(vals) + f" | {score_to_icon(ov)} {ov if ov else '—'} |")

    lines.append("")
    items = []
    for agent, ds in sorted(scores.items()):
        for d in DIMS:
            v = ds.get(d)
            if v is not None and v < 80:
                items.append(f"- {'🔴' if v < 50 else '🟡'} **{agent}**·{d}：{v}")

    if items:
        lines.append("### 异常项")
        lines.extend(items)
        lines.append("")

    lines.append("### 事件摘要")
    agg = aggregate_by_agent(events)
    for agent, evts in sorted(agg.items()):
        summary = "、".join(f"{k}:{v}" for k, v in sorted(evts.items()))
        lines.append(f"- **{agent}**：{summary}")
    lines.append("")

    total_evt = len(events)
    objective = sum(1 for e in events if e["event"] in OBJECTIVE_EVENTS)
    confidence = round(objective / max(1, total_evt) * 100, 1)
    lines.append(f"### 数据可信度")
    lines.append(f"- 客观事件占比：{confidence}%（{objective}/{total_evt}）")
    lines.append(f"- 来源Agent：{', '.join(sorted(set(e.get('agent', '?') for e in events)))}")
    lines.append("")

    return "\n".join(lines)


if __name__ == "__main__":
    import sys
    if len(sys.argv) >= 3:
        start = sys.argv[1]
        end = sys.argv[2]
    else:
        end = date.today().isoformat()
        start = (date.today() - timedelta(days=6)).isoformat()
    print(generate_report(start, end))
