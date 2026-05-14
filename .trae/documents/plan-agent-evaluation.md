# 实施计划：Agent 行为审计

## 目标

建立客观可量化的 Agent 事件评估体系，通过 JSONL 行为日志自动采集四维数据，生成周度评估卡片并驱动矫正。

## 架构依赖

- 数据存储：`memory/events/YYYY-MM-DD.jsonl`（JSONL 格式）
- 核心脚本：`scripts/agent-event-logger.py`
- CI 集成：扩展 `.github/workflows/weekly-review.yml`
- 评估引擎扩展：`scripts/evaluate-adjustments.py`

## 技术栈

- Python 3.11+（与现有 scripts 保持一致）
- 无外部依赖（标准库 json、pathlib、collections）
- CI：GitHub Actions（已有）

## 任务列表

---

### 任务 1：创建 memory/events 目录结构

**操作**：创建目录（空目录保留 `.gitkeep`）

```bash
mkdir -p memory/events
touch memory/events/.gitkeep
```

**验证**：

```bash
ls -la memory/events/
```

---

### 任务 2：实现事件日志模块（agent_event_logger.py 的核心）

**文件**：`scripts/agent_event_logger.py`

**功能**：

1. 向 JSONL 文件追加一行事件
2. 验证事件格式（必填字段检查）
3. 读取指定日期的所有事件
4. 按 Agent + 事件类型聚合统计

```python
#!/usr/bin/env python3
"""Agent behavior event logger — JSONL 行为事件日志"""

import json
import os
from datetime import datetime, date
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


def aggregate_by_dimension(events: list[dict]) -> dict:
    dim_event_map = {
        "铁律遵守": ["IRON_RULE_BREAK", "CLARIFY_ASK"],
        "工具准确": ["SKILL_CALL", "SKILL_MISS"],
        "文档使用": ["DOC_READ", "DOC_SKIP"],
        "角色尽职": ["BOUNDARY_VIOLATE", "YES_MAN", "ROLE_DUTY_DONE"],
    }
    dim_agg = {}
    for dim, evts in dim_event_map.items():
        total = sum(1 for e in events if e["event"] in evts)
        neg = sum(1 for e in events if e["event"] in {
            "IRON_RULE_BREAK", "SKILL_MISS", "DOC_SKIP",
            "BOUNDARY_VIOLATE", "YES_MAN",
        })
        dim_agg[dim] = {"total": total, "negative": neg, "events": evts}
    return dim_agg
```

---

### 任务 3：实现评估报告生成器（扩展 agent_event_logger.py）

**追加到同文件末尾**。

功能：读取指定周（或日期范围）的 events，输出四维评估卡片 Markdown。

```python
# === 评估报告生成 ===

AGENT_NAMES = {"陈锋", "苏染", "周严", "林墨"}
IRON_RULE_LABELS = {1: "需求澄清（铁律1）", 2: "技能调用（铁律2）", 3: "文档同步（铁律3）"}


def compute_dimension_scores(events: list[dict]) -> dict:
    """计算每个 Agent 的四维得分（0~100）"""
    by_agent = defaultdict(list)
    for e in events:
        agent = e.get("agent", "unknown")
        by_agent[agent].append(e)

    scores = {}
    for agent, agent_events in by_agent.items():
        s = {}

        # 工具准确率：SKILL_CALL / (SKILL_CALL + SKILL_MISS)
        calls = sum(1 for e in agent_events if e["event"] == "SKILL_CALL")
        misses = sum(1 for e in agent_events if e["event"] == "SKILL_MISS")
        s["工具准确"] = round(calls / (calls + misses) * 100, 1) if (calls + misses) > 0 else None

        # 文档使用率：DOC_READ / (DOC_READ + DOC_SKIP)
        reads = sum(1 for e in agent_events if e["event"] == "DOC_READ")
        skips = sum(1 for e in agent_events if e["event"] == "DOC_SKIP")
        s["文档使用"] = round(reads / (reads + skips) * 100, 1) if (reads + skips) > 0 else None

        # 铁律遵守率：(1 - 铁律1违例/任务数) × (1 - 铁律2违例/任务数) × (1 - 铁律3违例/任务数)
        rule_breaks = [e for e in agent_events if e["event"] == "IRON_RULE_BREAK"]
        total_tasks = max(1, len(set(e.get("context", "") for e in agent_events)))
        rule1 = sum(1 for e in rule_breaks if e.get("rule") == 1)
        rule2 = sum(1 for e in rule_breaks if e.get("rule") == 2)
        rule3 = sum(1 for e in rule_breaks if e.get("rule") == 3)
        iron_score = (1 - rule1 / total_tasks) * (1 - rule2 / total_tasks) * (1 - rule3 / total_tasks)
        s["铁律遵守"] = round(iron_score * 100, 1)

        # 角色尽职度：(职责覆盖率 × 40%) + (边界遵守率 × 40%) + (独立判断率 × 20%)
        duties = sum(1 for e in agent_events if e["event"] == "ROLE_DUTY_DONE")
        boundary_violations = sum(1 for e in agent_events if e["event"] == "BOUNDARY_VIOLATE")
        yes_man = sum(1 for e in agent_events if e["event"] == "YES_MAN")
        total_jobs = duties + boundary_violations + yes_man
        duty_score = duties / max(1, total_jobs) * 40
        boundary_score = (1 - boundary_violations / max(1, total_tasks)) * 40
        independence = (1 - yes_man / max(1, yes_man + 1)) * 20  # 至少1次反对视为满分
        s["角色尽职"] = round(duty_score + boundary_score + independence, 1)

        scores[agent] = s

    return scores


def score_to_icon(score: float) -> str:
    if score is None:
        return "—"
    if score >= 80:
        return "🟢"
    elif score >= 50:
        return "🟡"
    else:
        return "🔴"


def generate_report(start: str, end: str) -> str:
    events = load_events_range(start, end)
    scores = compute_dimension_scores(events)

    dims = ["铁律遵守", "工具准确", "文档使用", "角色尽职"]

    lines = []
    lines.append(f"# Agent 周度评估卡片")
    lines.append(f"## 周期：{start} ~ {end}")
    lines.append("")
    lines.append("| Agent | " + " | ".join(dims) + " | 综合 |")
    lines.append("|" + "|".join(["---"] * (len(dims) + 2)) + "|")

    overall = {}
    for agent, ds in sorted(scores.items()):
        vals = []
        for d in dims:
            v = ds.get(d)
            vals.append(f"{v if v is not None else '—'} {score_to_icon(v)}")
        agent_short = {"陈锋": "陈锋(开)", "苏染": "苏染(设)", "周严": "周严(测)", "林墨": "林墨(产)"}.get(agent, agent)
        valid = [ds[d] for d in dims if ds.get(d) is not None]
        overall[agent] = round(sum(valid) / len(valid), 1) if valid else None
        ov = overall[agent]
        lines.append(f"| {agent_short} | " + " | ".join(vals) + f" | {ov if ov else '—'} |")

    lines.append("")

    # 异常项
    items = []
    for agent, ds in sorted(scores.items()):
        for d in dims:
            v = ds.get(d)
            if v is not None and v < 50:
                items.append(f"- 🔴 {agent}·{d}：得分 {v}")
            elif v is not None and v < 80:
                items.append(f"- 🟡 {agent}·{d}：得分 {v}")

    if items:
        lines.append("### 异常项")
        lines.extend(items)
        lines.append("")

    # 事件摘要
    lines.append("### 事件摘要")
    agg = aggregate_by_agent(events)
    for agent, evts in sorted(agg.items()):
        summary = "、".join(f"{k}:{v}" for k, v in sorted(evts.items()))
        lines.append(f"- **{agent}**：{summary}")
    lines.append("")

    # 自检可信度
    total_events = len(events)
    objective = sum(1 for e in events if e["event"] in {"SKILL_CALL", "DOC_READ", "ROLE_DUTY_DONE"})
    subjective = total_events - objective
    confidence = round(objective / max(1, total_events) * 100, 1)
    lines.append(f"### 数据可信度")
    lines.append(f"- 客观事件占比：{confidence}%（{objective}/{total_events}）")
    lines.append(f"- 主观事件占比：{100 - confidence}%（{subjective}/{total_events}）")
    lines.append(f"- 来源：{', '.join(sorted(set(e.get('agent', '?') for e in events)))}")
    lines.append("")

    return "\n".join(lines)


if __name__ == "__main__":
    import sys
    if len(sys.argv) >= 3:
        start = sys.argv[1]
        end = sys.argv[2]
    else:
        from datetime import timedelta
        end = date.today().isoformat()
        start = (date.today() - timedelta(days=6)).isoformat()
    print(generate_report(start, end))
```

**验证**：

```bash
# 创建测试事件
echo '{"event": "SKILL_CALL", "agent": "陈锋", "skill": "api-and-interface-design", "context": "设计新API", "timestamp": "2026-05-14T10:00:01Z"}' >> memory/events/2026-05-14.jsonl
echo '{"event": "SKILL_MISS", "agent": "陈锋", "should_have": "frontend-design", "context": "写页面组件", "timestamp": "2026-05-14T10:05:00Z"}' >> memory/events/2026-05-14.jsonl
echo '{"event": "DOC_READ", "agent": "陈锋", "doc": "docs/00-governance/harness/01-workflows.md", "reason": "确认流程", "timestamp": "2026-05-14T10:10:00Z"}' >> memory/events/2026-05-14.jsonl
echo '{"event": "IRON_RULE_BREAK", "agent": "陈锋", "rule": 1, "desc": "需求模糊未追问", "timestamp": "2026-05-14T10:15:00Z"}' >> memory/events/2026-05-14.jsonl
echo '{"event": "ROLE_DUTY_DONE", "agent": "陈锋", "duty": "架构决策与ADR", "timestamp": "2026-05-14T10:20:00Z"}' >> memory/events/2026-05-14.jsonl

python3 scripts/agent_event_logger.py 2026-05-14 2026-05-14
```

---

### 任务 4：扩展 weekly-review.yml

**文件**：`.github/workflows/weekly-review.yml`

在 `Run evaluation` step 之后新增一个 step，运行事件评估报告生成。

```yaml
- name: Run agent evaluation report
  run: |
    python3 scripts/agent_event_logger.py --write-md
    echo "## 四维 Agent 评估结果" >> $GITHUB_STEP_SUMMARY
    python3 scripts/agent_event_logger.py >> $GITHUB_STEP_SUMMARY
```

> 注：具体 CI 注入方式需根据现有 weekly-review.yml 的实际结构适配。

---

### 任务 5：扩展 evaluate-adjustments.py

**文件**：`scripts/evaluate-adjustments.py`

在现有 TR-001 到 TR-008 的规则后，新增两条基于新事件指标的触发规则：

**TR-009：文档依赖率低**

- 触发条件：`DOC_READ / (DOC_READ + DOC_SKIP) < 0.5`
- 严重级别：L2
- 矫正动作：在对应 Agent 的 rules 中注入"决策前必须查阅对应文档"指令

**TR-010：越界率过高**

- 触发条件：`BOUNDARY_VIOLATE 次数 > 任务数 × 0.3`
- 严重级别：L1
- 矫正动作：强制注入边界约束指令，回顾角色 YAML

---

### 任务 6：在 Agent YAML 中注入事件指令

**操作**：在三个 Agent 的 rules/指令中，加入"每次会话结束时写入事件日志"的自述指令。

具体写入 SKILL_CALL、DOC_READ 的正向事件，以及 IRON_RULE_BREAK 的违规自述。

涉及文件：

- `.trae/agents/developer.yaml`（陈锋）
- `.trae/agents/designer.yaml`（苏染）
- `.trae/agents/tester.yaml`（周严）

在每个文件的规则/指令段落末尾追加：

```yaml
# 事件日志指令
# 每次 Agent 会话结束时，必须将本次会话中的关键行为写入 memory/events/YYYY-MM-DD.jsonl
# 记录规则：
#   - 每次调用技能 → SKILL_CALL {"agent": "xx", "skill": "技能名", "context": "场景"}
#   - 每次查阅项目文档 → DOC_READ {"agent": "xx", "doc": "路径", "reason": "目的"}
#   - 违规铁律 → IRON_RULE_BREAK {"agent": "xx", "rule": 1|2|3, "desc": "描述"}
#   - 越界 → BOUNDARY_VIOLATE {"agent": "xx", "violation": "描述"}
#   - 盲从 → YES_MAN {"agent": "xx", "context": "描述", "should_oppose": true}
# 严格使用标准 JSONL 格式，一行一条
```

---

### 任务 7：最终集成测试

**操作**：模拟一周事件数据，运行完整链路。

```bash
# 1. 写入 5 天的模拟事件
python3 -c "
from scripts.agent_event_logger import log_event
events = [
    # 陈锋数据
    {'event': 'SKILL_CALL', 'agent': '陈锋', 'skill': 'api-and-interface-design', 'context': '新API'},
    {'event': 'DOC_READ', 'agent': '陈锋', 'doc': 'docs/02-architecture/project-task-driven-architecture.md', 'reason': '确认架构'},
    {'event': 'ROLE_DUTY_DONE', 'agent': '陈锋', 'duty': '架构决策'},
    {'event': 'SKILL_MISS', 'agent': '陈锋', 'should_have': 'karpathy-guidelines', 'context': '开始编码'},
    # 苏染数据
    {'event': 'SKILL_CALL', 'agent': '苏染', 'skill': 'frontend-ui-engineering', 'context': '构建组件'},
    {'event': 'DOC_READ', 'agent': '苏染', 'doc': 'docs/02-design/design-spec-v2-shadcn.md', 'reason': '确认设计规范'},
    {'event': 'ROLE_DUTY_DONE', 'agent': '苏染', 'duty': '实现UI界面'},
    # 周严数据
    {'event': 'SKILL_CALL', 'agent': '周严', 'skill': 'debugging-and-error-recovery', 'context': '调试测试'},
    {'event': 'DOC_READ', 'agent': '周严', 'doc': 'docs/04-testing/testing-standards.md', 'reason': '确认测试标准'},
    {'event': 'ROLE_DUTY_DONE', 'agent': '周严', 'duty': '编写测试用例'},
]
for e in events:
    log_event(e)
"

# 2. 生成周度报告
python3 scripts/agent_event_logger.py 2026-05-14 2026-05-14

# 3. 清理测试数据
rm memory/events/2026-05-14.jsonl
```

---

## 任务执行顺序

| 顺序 | 任务                         | 依赖         |
| ---- | ---------------------------- | ------------ |
| 1    | 创建目录结构                 | 无           |
| 2    | 实现事件日志模块             | 1            |
| 3    | 实现评估报告生成器           | 2            |
| 4    | 实现测试（先测试后实现）     | 无（可并行） |
| 5    | 扩展 weekly-review.yml       | 3            |
| 6    | 扩展 evaluate-adjustments.py | 3            |
| 7    | 注入 Agent YAML 指令         | 无           |
| 8    | 集成测试                     | 2~7          |
