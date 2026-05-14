#!/usr/bin/env python3
"""
Harness 自适应评估引擎（L2.5 行为调节层）

用法:
    python3 scripts/evaluate-adjustments.py \\
        --days 14 \\
        --output .harness/adjustments.yaml \\
        --agfile AGENTS.md

功能:
    1. 扫描 memory/ 中近期 daily logs 的自检块
    2. 按角色聚合指标违规
    3. 对照触发规则表生成调节
    4. 写入 adjustments.yaml
    5. 同步矫正块到 AGENTS.md
    6. L3+ 调节生成审批待办文件
"""

import argparse
import glob
import json
import os
import re
import sys
from collections import defaultdict
from datetime import datetime, timedelta
from pathlib import Path


# ============================================================
# 触发规则表
# ============================================================
TRIGGER_RULES = [
    {
        "id": "TR-001",
        "name": "技能遗漏率高",
        "metric": "跳skill",
        "threshold": 3,
        "window": "per_day",
        "role": "全部",
        "action": "force_skill",
        "severity": "L2",
        "params": {
            "skill": None,
            "mode": "mandatory",
            "inject": True,
        },
        "message_tpl": "近 7 天 {role} 技能遗漏 {value} 次/日",
    },
    {
        "id": "TR-002",
        "name": "需求偏差度高",
        "metric": "需求偏差",
        "threshold": 2,
        "window": "avg_7d",
        "role": "产品",
        "action": "escalate_depth",
        "severity": "L2",
        "params": {
            "phase": "review",
            "from_level": "L1",
            "to_level": "L2",
        },
        "message_tpl": "近 7 天需求偏差度 {value}，验收阶段升级为双人评审",
    },
    {
        "id": "TR-003",
        "name": "编码规范跳过频繁",
        "metric": "karpathy遗漏",
        "threshold": 3,
        "window": "cumulative_7d",
        "role": "开发",
        "action": "force_skill",
        "severity": "L2",
        "params": {
            "skill": "karpathy-guidelines",
            "mode": "mandatory",
            "inject": True,
        },
        "message_tpl": "近 7 天 karpathy-guidelines 跳过 {value} 次，升级为强制技能",
    },
    {
        "id": "TR-004",
        "name": "中文率低",
        "metric": "英文思考",
        "threshold": 3,
        "window": "cumulative_7d",
        "role": "全部",
        "action": "inject_prompt",
        "severity": "L1",
        "params": {},
        "message_tpl": "近 7 天英文思考 {value} 次，请注意全程中文",
    },
    {
        "id": "TR-005",
        "name": "反模式反复出现",
        "metric": "反模式",
        "threshold": 3,
        "window": "cumulative_7d",
        "role": "全部",
        "action": "force_skill",
        "severity": "L2",
        "params": {
            "skill": None,
            "mode": "mandatory",
            "inject": True,
        },
        "message_tpl": "rules.md 反模式出现 {value} 次，触发强制矫正",
    },
    {
        "id": "TR-006",
        "name": "设计可访问性差",
        "metric": "可访问性阻断",
        "threshold": 1,
        "window": "cumulative_7d",
        "role": "设计",
        "action": "force_skill",
        "severity": "L2",
        "params": {
            "skill": "accessibility",
            "mode": "mandatory",
            "inject": True,
        },
        "message_tpl": "出现可访问性阻断项，accessibility 技能升级为强制",
    },
    {
        "id": "TR-007",
        "name": "编码审查失败率高",
        "metric": "代码审查一次通过率",
        "threshold": 40,
        "window": "avg_7d",
        "role": "开发",
        "action": "escalate_depth",
        "severity": "L3",
        "params": {
            "phase": "review",
            "from_level": "L1",
            "to_level": "L3",
        },
        "message_tpl": "近 7 天代码审查一次通过率 {value}%，评审阶段升级为全量 4 人验收",
    },
    {
        "id": "TR-008",
        "name": "E2E 失败",
        "metric": "e2e_pass_rate",
        "threshold": 100,
        "window": "cumulative_7d",
        "role": "全部",
        "action": "freeze_autopilot",
        "severity": "L4",
        "params": {},
        "message_tpl": "E2E 通过率 < 100%，冻结自主交付权限",
    },
    {
        "id": "TR-009",
        "name": "文档依赖率低",
        "metric": "doc_skip_ratio",
        "threshold": 50,
        "window": "cumulative_7d",
        "role": "全部",
        "action": "inject_doc_rule",
        "severity": "L2",
        "params": {
            "inject": True,
        },
        "message_tpl": "{role} 文档跳过率 {value}%（≥50%），需注入决策前查阅指令",
    },
    {
        "id": "TR-010",
        "name": "越界率过高",
        "metric": "boundary_violation_ratio",
        "threshold": 30,
        "window": "cumulative_7d",
        "role": "全部",
        "action": "inject_boundary_rule",
        "severity": "L1",
        "params": {
            "inject": True,
        },
        "message_tpl": "{role} 越界率 {value}%（≥30%），需强制执行边界约束",
    },
]


# ============================================================
# 解析器
# ============================================================

def parse_self_check_blocks(content):
    """从 daily log 的自检块提取违规数据"""
    violations = {}

    # 主模式：表格格式 | 避坑 | xxx |
    pattern = r"\| 避坑 \|(.+?)\|"
    for m in re.finditer(pattern, content):
        text = m.group(1)
        for item in re.findall(r"(\D+?)\s*(\d+)\s*次?", text):
            name = item[0].strip().lstrip("/").strip()
            count = int(item[1])
            if count > 0 and name:
                violations[name] = violations.get(name, 0) + count

    # 兜底模式 A：避坑：N次（E1 xxx / E2 xxx / ...）
    fallback_a = r"避坑[：:]\s*(\d+)\s*次[（(](.+?)[）)]"
    for m in re.finditer(fallback_a, content):
        total = int(m.group(1))
        details = m.group(2)
        if total > 0:
            for item in re.split(r"[／/]", details):
                item = item.strip()
                e_match = re.match(r"E\d+\s+(.+)", item)
                if e_match:
                    name = e_match.group(1).strip()
                    if name:
                        violations[name] = violations.get(name, 0) + 1
                else:
                    name = re.sub(r"\d+\s*次?", "", item).strip()
                    if name:
                        violations[name] = violations.get(name, 0) + 1

    # 兜底模式 B：避坑：0次（无违规，跳过）

    # 兜底模式 C：纯中文 "避坑：英文思考 3次 跳skill 2次"
    fallback_c = r"避坑[：:]\s*(.+)"
    for m in re.finditer(fallback_c, content):
        text = m.group(1).strip()
        for item in re.findall(r"(\D+?)\s*(\d+)\s*次?", text):
            name = item[0].strip().lstrip("/").strip()
            count = int(item[1])
            if count > 0 and name and name not in violations:
                violations[name] = violations.get(name, 0) + count

    return violations


def parse_rules_anti_patterns(content):
    """从 rules.md 提取反模式出现次数"""
    counts = {}
    pattern = r"\| \d+ \| (.+?) \| (\d+)\+? \|"
    for m in re.finditer(pattern, content):
        name = m.group(1).strip()
        count = int(m.group(2))
        counts[name] = count
    return counts


def read_yaml_simple(path):
    """简易 YAML 读取（仅支持当前结构）"""
    data = {"active_adjustments": [], "inactive_adjustments": []}
    try:
        with open(path) as f:
            content = f.read()
    except (FileNotFoundError, IOError):
        return data

    current_list = None
    for line in content.split("\n"):
        stripped = line.strip()
        if stripped == "active_adjustments: []" or stripped == "active_adjustments:":  
            current_list = "active" if stripped.endswith(":") else None
            continue
        if stripped == "inactive_adjustments: []" or stripped == "inactive_adjustments:":
            current_list = "inactive" if stripped.endswith(":") else None
            continue
    return data


# ============================================================
# 评估逻辑
# ============================================================

def compute_averages(violations, num_days):
    """计算日均和累加"""
    result = {}
    nd = max(num_days, 1)
    for k, v in violations.items():
        result[k] = {
            "cumulative": v,
            "daily_avg": round(v / nd, 1),
        }
    return result


def compute_event_metrics(event_dir="memory/events", days=14):
    """从 JSONL 事件日志中读取事件指标"""
    cutoff = datetime.utcnow() - timedelta(days=days)
    metrics = {}

    event_path = Path(event_dir)
    if not event_path.exists():
        return metrics

    for fpath in sorted(event_path.glob("*.jsonl")):
        fname = fpath.stem
        try:
            fdate = datetime.strptime(fname, "%Y-%m-%d")
            if fdate < cutoff:
                continue
        except ValueError:
            continue

        with open(fpath) as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    event = json.loads(line)
                except json.JSONDecodeError:
                    continue

                agent = event.get("agent", "unknown")

                if event.get("event") == "SKILL_MISS":
                    key = f"{agent}_skill_miss"
                    metrics[key] = metrics.get(key, 0) + 1

                if event.get("event") == "DOC_SKIP":
                    key = f"{agent}_doc_skip"
                    metrics[key] = metrics.get(key, 0) + 1

                reads = 1 if event.get("event") == "DOC_READ" else 0
                skips = 1 if event.get("event") == "DOC_SKIP" else 0
                if reads or skips:
                    rkey = f"{agent}_doc_reads"
                    skey = f"{agent}_doc_skips"
                    metrics[rkey] = metrics.get(rkey, 0) + reads
                    metrics[skey] = metrics.get(skey, 0) + skips

                if event.get("event") == "BOUNDARY_VIOLATE":
                    key = f"{agent}_boundary_violation"
                    metrics[key] = metrics.get(key, 0) + 1

                if event.get("event") in ("ROLE_DUTY_DONE", "BOUNDARY_VIOLATE", "YES_MAN"):
                    dkey = f"{agent}_total_jobs"
                    metrics[dkey] = metrics.get(dkey, 0) + 1

    return metrics


def compute_event_derived_metrics(raw_metrics):
    """从原始事件计数计算派生指标（百分比）"""
    derived = {}

    # doc_skip_ratio: 适用于全部 Agent
    all_reads = sum(v for k, v in raw_metrics.items() if k.endswith("_doc_reads"))
    all_skips = sum(v for k, v in raw_metrics.items() if k.endswith("_doc_skips"))
    total = all_reads + all_skips
    if total > 0:
        derived["doc_skip_ratio"] = {
            "cumulative": round(all_skips / total * 100, 1),
            "daily_avg": round(all_skips / max(total, 1) * 100, 1),
        }

    # boundary_violation_ratio: 适用于全部 Agent
    all_violations = sum(v for k, v in raw_metrics.items() if k.endswith("_boundary_violation"))
    all_jobs = sum(v for k, v in raw_metrics.items() if k.endswith("_total_jobs"))
    if all_jobs > 0:
        derived["boundary_violation_ratio"] = {
            "cumulative": round(all_violations / all_jobs * 100, 1),
            "daily_avg": round(all_violations / max(1, all_jobs) * 100, 1),
        }

    return derived


def match_rules(metrics, role_hint=None):
    """将聚合指标匹配触发规则"""
    matched = []
    for rule in TRIGGER_RULES:
        if rule["role"] != "全部" and rule["role"] != role_hint:
            continue
        for metric_name, metric_val in metrics.items():
            if metric_name == rule["metric"]:
                val = metric_val["cumulative"]
                if val >= rule["threshold"]:
                    matched.append(rule)
    return matched


def build_adjustment(rule, value, role):
    """从匹配的规则生成调节记录"""
    now = datetime.utcnow()
    role_short = {"产品": "pm", "设计": "design", "开发": "dev", "测试": "qa"}.get(role, role)
    aid = f"adj-{now.strftime('%Y%m%d')}-{role_short}-{rule['id']}"
    return {
        "id": aid,
        "role": rule["role"] if rule["role"] != "全部" else role,
        "trigger": rule["name"],
        "action": rule["action"],
        "severity": rule["severity"],
        "params": rule["params"],
        "message": rule["message_tpl"].format(role=role, value=value),
        "applied": now.strftime("%Y-%m-%d"),
        "expires": (now + timedelta(days=7)).strftime("%Y-%m-%d"),
        "status": "pending_approval" if rule["severity"] in ("L3", "L4") else "active",
    }


def merge_adjustments(existing, new_adj):
    """合并新调节到现有列表（去重 + 更新）"""
    existing_ids = {a["id"] for a in existing}
    merged = list(existing)

    # 检查是否有相同触发条件的已存在
    for i, ex in enumerate(existing):
        if ex["trigger"] == new_adj["trigger"] and ex["role"] == new_adj["role"]:
            if ex["status"] in ("overridden",):
                return merged  # 人类已手动覆盖，不动
            merged[i] = new_adj
            return merged

    if new_adj["id"] not in existing_ids:
        merged.append(new_adj)
    return merged


def expire_old_adjustments(adjustments):
    """移除过期的调节"""
    now = datetime.utcnow()
    keep = []
    expired = []
    for adj in adjustments:
        try:
            expires = datetime.strptime(adj["expires"], "%Y-%m-%d")
            if expires < now:
                adj["status"] = "expired"
                expired.append(adj)
            else:
                keep.append(adj)
        except (ValueError, KeyError):
            keep.append(adj)
    return keep, expired


def generate_correction_blocks(adjustments):
    """从 active 调节生成 AGENTS.md 矫正块文本"""
    active = [a for a in adjustments if a.get("status") in ("active", "pending_approval")]
    system_adjs = [a for a in active if a.get("severity", "L1") in ("L1", "L2")]
    human_adjs = [a for a in active if a.get("severity", "L1") in ("L3", "L4") or a.get("status") == "pending_approval"]

    if not active:
        return "<!-- 当前无活跃矫正指令 -->\n"

    lines = []
    lines.append("<!-- ADJUSTMENTS-START -->")
    lines.append("<!-- 以下为 harness 自动注入的行为矫正指令，基于近期指标表现 -->")
    lines.append("<!-- 如需手动覆盖，请将对应条目的 status 改为 overridden -->")
    lines.append("")

    if system_adjs:
        lines.append("## 系统级自动矫正")
        lines.append("")
        for adj in system_adjs:
            lines.append(f"### 会话级矫正（{adj['applied']} ~ {adj['expires']}）")
            lines.append(f"- [ ] **{adj['role']}**：{adj['message']}")
            lines.append("")

    if human_adjs:
        lines.append("## ⚠️ 待人类处理")
        lines.append("")
        lines.append("> 以下调节需要人类审批后才能生效，详见 `memory/pending-human-tasks.md`")
        lines.append("")
        for adj in human_adjs:
            lines.append(f"- **{adj['role']}** [{adj.get('severity', 'L3')}]：{adj['message']}")
            lines.append(f"  → 审批后执行：{adj.get('action', 'pending')}")
        lines.append("")

    lines.append("<!-- ADJUSTMENTS-END -->")
    return "\n".join(lines)


def sync_agfile(agfile_path, correction_text):
    """将矫正块写入 AGENTS.md 的标记段内"""
    with open(agfile_path) as f:
        content = f.read()

    start_marker = "<!-- ADJUSTMENTS-START -->"
    end_marker = "<!-- ADJUSTMENTS-END -->"

    replacement = (
        "<!-- ADJUSTMENTS-START -->\n"
        + correction_text.split("<!-- ADJUSTMENTS-START -->")[1]
        if "<!-- ADJUSTMENTS-START -->" in correction_text
        else correction_text
    )

    if start_marker in content and end_marker in content:
        pattern = re.compile(
            re.escape(start_marker) + r".*?" + re.escape(end_marker),
            re.DOTALL,
        )
        new_content = pattern.sub(correction_text, content)
    else:
        new_content = content.rstrip() + "\n\n" + correction_text

    with open(agfile_path, "w") as f:
        f.write(new_content)

    print(f"  ✓ 已同步矫正块到 {agfile_path}")


def write_adjustments(adjustments, inactive, output_path):
    """写 adjustments.yaml"""
    lines = []
    lines.append("# Harness 工程框架 — 行为调节状态存储")
    lines.append("# 由 scripts/evaluate-adjustments.py 自动管理，勿手动编辑")
    lines.append("# 人类可手动覆盖：将 status 改为 overridden 即停止该调节")
    lines.append("")
    lines.append(f"version: \"1.0\"")
    lines.append(f"last_evaluated: \"{datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')}\"")
    lines.append(f"last_evaluated_by: \"harness-bot\"")
    lines.append("")

    lines.append("active_adjustments:")
    if not adjustments:
        lines.append("  []")
    else:
        for adj in adjustments:
            lines.append(f"  - id: {adj['id']}")
            lines.append(f"    role: {adj['role']}")
            lines.append(f"    trigger: \"{adj['trigger']}\"")
            lines.append(f"    action: {adj['action']}")
            lines.append(f"    severity: {adj['severity']}")
            if adj.get("params"):
                lines.append(f"    params:")
                for pk, pv in adj["params"].items():
                    if pv is not None:
                        lines.append(f"      {pk}: {pv}")
            lines.append(f"    message: \"{adj['message']}\"")
            lines.append(f"    applied: \"{adj['applied']}\"")
            lines.append(f"    expires: \"{adj['expires']}\"")
            lines.append(f"    status: {adj['status']}")
            lines.append("")

    lines.append("inactive_adjustments:")
    if not inactive:
        lines.append("  []")
    else:
        for adj in inactive:
            lines.append(f"  - id: {adj['id']}")
            lines.append(f"    status: {adj['status']}")
            lines.append(f"    expired: \"{adj.get('expires', 'unknown')}\"")
            lines.append("")

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w") as f:
        f.write("\n".join(lines) + "\n")
    print(f"  ✓ 已写入 {output_path}")


def verify_effectiveness(args):
    """验证模式：对比矫正前后指标，判断改善/不变/恶化"""
    print(f"🔍 矫正效果验证模式启动")
    print()

    output_path = args.output
    try:
        with open(output_path) as f:
            existing_content = f.read()
    except (FileNotFoundError, IOError):
        print(f"❌ {output_path} 不存在，无法验证")
        return 1

    active_adjs = re.findall(
        r"  - id: (\S+).*?"
        r"    role: (\S+).*?"
        r"    trigger: \"(.*?)\".*?"
        r"    action: (\S+).*?"
        r"    severity: (\S+).*?"
        r"(?:    params:.*?)?"
        r"    message: \"(.*?)\".*?"
        r"    applied: \"(\d{4}-\d{2}-\d{2})\".*?"
        r"    expires: \"(\d{4}-\d{2}-\d{2})\".*?"
        r"    status: (active|pending_approval)",
        existing_content,
        re.DOTALL,
    )

    if not active_adjs:
        print("✅ 无活跃调节，无需验证")
        return 0

    print(f"共 {len(active_adjs)} 条活跃调节待验证\n")

    reports = []
    changed_adjs = []

    for m in active_adjs:
        adj_id, role, trigger, action, severity, message, applied, expires, status = m
        try:
            applied_date = datetime.strptime(applied, "%Y-%m-%d")
        except ValueError:
            print(f"⚠️  跳过 {adj_id}（applied 日期无效）")
            continue

        metric_map = {
            "技能遗漏率高": "跳skill",
            "中文率低": "英文思考",
            "编码规范跳过频繁": "karpathy遗漏",
            "需求偏差度高": "需求偏差",
            "反模式反复出现": "反模式",
            "设计可访问性差": "可访问性阻断",
            "编码审查失败率高": "代码审查一次通过率",
            "E2E 失败": "e2e_pass_rate",
        }
        metric_key = metric_map.get(trigger)
        if not metric_key:
            print(f"⚠️  跳过 {adj_id}（无法映射 trigger: {trigger}）")
            continue

        before_start = applied_date - timedelta(days=7)
        after_end = min(applied_date + timedelta(days=7), datetime.utcnow())

        before_violations = collect_violations(before_start, applied_date)
        after_violations = collect_violations(applied_date, after_end)

        before_val = before_violations.get(metric_key, 0)
        after_val = after_violations.get(metric_key, 0)

        before_days = max((applied_date - before_start).days, 1)
        after_days = max((after_end - applied_date).days, 1)
        before_avg = round(before_val / before_days, 1)
        after_avg = round(after_val / after_days, 1)

        if after_val < before_val:
            verdict = "改善"
            new_severity = severity
            new_status = "resolved" if severity in ("L1", "L2") else "pending_approval"
        elif after_val == before_val:
            verdict = "未改善"
            new_severity = severity
            new_status = "active"
        else:
            verdict = "恶化"
            sev_map = {"L1": "L2", "L2": "L3", "L3": "L4", "L4": "L4"}
            new_severity = sev_map.get(severity, severity)
            new_status = "active" if new_severity in ("L1", "L2") else "pending_approval"

        report = {
            "id": adj_id,
            "role": role,
            "trigger": trigger,
            "severity": severity,
            "new_severity": new_severity if verdict == "恶化" else severity,
            "status": status,
            "new_status": new_status,
            "verdict": verdict,
            "before": {"value": before_val, "daily_avg": before_avg, "days": before_days},
            "after": {"value": after_val, "daily_avg": after_avg, "days": after_days},
        }
        reports.append(report)

        if new_severity != severity or new_status != status:
            changed_adjs.append((adj_id, new_severity, new_status))

        icon = {"改善": "✅", "未改善": "⚠️", "恶化": "🔴"}.get(verdict, "?")
        print(f"  {icon} {adj_id}: {role}/{trigger}")
        print(f"      矫正前: {before_val}次 / {before_days}天 (日均 {before_avg})")
        print(f"      矫正后: {after_val}次 / {after_days}天 (日均 {after_avg})")
        if verdict == "恶化":
            print(f"      severity: {severity} → {new_severity}")
        print()

    if changed_adjs:
        print(f"\n⚠️  {len(changed_adjs)} 条调节状态变更:")
        for aid, new_sev, new_st in changed_adjs:
            print(f"      {aid}: severity → {new_sev}, status → {new_st}")

    write_effectiveness_report(reports, "memory/stats/adjustment-effectiveness.md")

    if changed_adjs and not args.dry_run:
        print(f"\n💡 运行 python3 scripts/evaluate-adjustments.py --days 14 以应用变更")
        print(f"   或设置 --apply 立即写入 adjustments.yaml")

    return 0


def collect_violations(start_date, end_date):
    """收集指定时间窗口内的违规数据"""
    violations = {}
    log_dir = "memory"
    for fpath in sorted(glob.glob(f"{log_dir}/2026-*.md")):
        fname = os.path.basename(fpath).replace(".md", "")
        try:
            fdate = datetime.strptime(fname, "%Y-%m-%d")
            if fdate < start_date or fdate >= end_date:
                continue
        except ValueError:
            continue
        with open(fpath) as f:
            content = f.read()
        for k, v in parse_self_check_blocks(content).items():
            violations[k] = violations.get(k, 0) + v
    return violations


def write_effectiveness_report(reports, path):
    """写入矫正效果验证报告"""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    now = datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
    lines = [
        "# 矫正效果验证报告",
        f"生成时间: {now}",
        "",
        "| ID | 角色 | 触发条件 | 等级 | 矫正前 | 矫正后 | 结论 |",
        "|---|------|---------|------|--------|--------|------|",
    ]
    for r in reports:
        before_str = f"{r['before']['value']}次 / {r['before']['days']}天 (日均{r['before']['daily_avg']})"
        after_str = f"{r['after']['value']}次 / {r['after']['days']}天 (日均{r['after']['daily_avg']})"
        lines.append(
            f"| {r['id']} | {r['role']} | {r['trigger']} | {r['severity']} | {before_str} | {after_str} | {r['verdict']} |"
        )
    lines.append("")

    improved = [r for r in reports if r["verdict"] == "改善"]
    unchanged = [r for r in reports if r["verdict"] == "未改善"]
    degraded = [r for r in reports if r["verdict"] == "恶化"]

    lines.append(f"## 汇总")
    lines.append(f"- 改善: {len(improved)} 条")
    lines.append(f"- 未改善: {len(unchanged)} 条")
    lines.append(f"- 恶化: {len(degraded)} 条")
    lines.append("")

    if degraded:
        lines.append("## 🔴 恶化详情")
        for r in degraded:
            lines.append(f"- {r['id']}: {r['role']}/{r['trigger']} ({r['severity']}→{r['new_severity']})")
        lines.append("")

    with open(path, "w") as f:
        f.write("\n".join(lines) + "\n")
    print(f"  ✓ 验证报告已写入 {path}")


def write_pending_human_tasks(adjustments, path="memory/pending-human-tasks.md"):
    """更新待人类处理任务清单"""
    pending = [a for a in adjustments if a.get("status") == "pending_approval"]
    os.makedirs(os.path.dirname(path), exist_ok=True)

    now = datetime.utcnow().strftime("%Y-%m-%d")

    lines = []
    lines.append("# 待人类处理任务")
    lines.append("")
    lines.append("> 由 evaluate-adjustments.py 自动维护，人类处理后手动更新状态")
    lines.append("")

    lines.append("## 待审批调节（L3-L4）")
    lines.append("")
    if pending:
        lines.append("| ID | 角色 | 触发条件 | 严重度 | 状态 | 创建日期 |")
        lines.append("|----|------|---------|--------|------|---------|")
        for p in pending:
            lines.append(f"| {p['id']} | {p['role']} | {p['trigger']} | {p.get('severity', 'L3')} | {p['status']} | {p.get('applied', now)} |")
    else:
        lines.append("（无待审批项）")
    lines.append("")

    lines.append("## 待分配技能（Lark 技能）")
    lines.append("")
    lines.append("| 技能名 | 状态 | 建议角色 | 创建日期 |")
    lines.append("|--------|------|---------|---------|")

    with open(path, "w") as f:
        f.write("\n".join(lines) + "\n")
    print(f"  ✓ 待办清单已写入 {path}")


def main():
    parser = argparse.ArgumentParser(description="Harness 自适应评估引擎")
    parser.add_argument("--days", type=int, default=14, help="分析窗口（天）")
    parser.add_argument("--output", default=".harness/adjustments.yaml", help="调节输出路径")
    parser.add_argument("--agfile", default="AGENTS.md", help="AGENTS.md 路径")
    parser.add_argument("--dry-run", action="store_true", help="仅预览不写文件")
    parser.add_argument("--verify", action="store_true", help="验证模式：对比矫正前后效果")
    args = parser.parse_args()

    if args.verify:
        sys.exit(verify_effectiveness(args))

    print(f"🔄 自适应评估引擎启动（窗口: {args.days} 天）")

    # 1. 扫描 memory/ 中自检块
    all_violations = {}
    cutoff = datetime.utcnow() - timedelta(days=args.days)
    log_dir = "memory"
    file_count = 0

    for fpath in sorted(glob.glob(f"{log_dir}/2026-*.md")):
        fname = os.path.basename(fpath).replace(".md", "")
        try:
            fdate = datetime.strptime(fname, "%Y-%m-%d")
            if fdate < cutoff:
                continue
        except ValueError:
            continue

        with open(fpath) as f:
            content = f.read()

        if "| 避坑 |" not in content:
            continue

        violations = parse_self_check_blocks(content)
        for k, v in violations.items():
            all_violations[k] = all_violations.get(k, 0) + v
        file_count += 1

    print(f"  → 扫描 {file_count} 个 daily log，发现 {len(all_violations)} 类违规")

    # 2. 检查 rules.md 反模式
    rules_path = "docs/ai/knowledge/rules.md"
    anti_pattern_count = 0
    try:
        with open(rules_path) as f:
            rules_content = f.read()
        anti_patterns = parse_rules_anti_patterns(rules_content)
        for name, count in anti_patterns.items():
            if count >= 3:
                anti_pattern_count += count
                all_violations["反模式"] = all_violations.get("反模式", 0) + count
        print(f"  → rules.md 反模式: {len(anti_patterns)} 条，其中 ≥3 次: {anti_pattern_count}")
    except (FileNotFoundError, IOError):
        print(f"  → rules.md 不存在，跳过")

    # 2.5 读取事件日志获取事件指标
    raw_event_metrics = compute_event_metrics("memory/events", args.days)
    event_derived = compute_event_derived_metrics(raw_event_metrics)
    if event_derived:
        print(f"  → 事件日志派生指标:")
        for k, v in sorted(event_derived.items()):
            print(f"      {k}: {v['cumulative']}（累计）, {v['daily_avg']}/日")

    # 3. 计算聚合指标
    metrics = compute_averages(all_violations, args.days)
    if event_derived:
        metrics.update(event_derived)
    if metrics:
        print(f"  → 聚合指标（日均/累计）:")
        for k, v in sorted(metrics.items()):
            print(f"      {k}: {v['daily_avg']}/日, 累计{v['cumulative']}")

    # 4. 读取当前调整
    current_adjustments = []
    current_inactive = []
    try:
        with open(args.output) as f:
            existing_content = f.read()

        adj_match = re.findall(
            r"  - id: (\S+)\s+"
            r"    role: (\S+).*?"
            r"    trigger: \"(.*?)\".*?"
            r"    action: (\S+).*?"
            r"    severity: (\S+).*?"
            r"    status: (\S+)",
            existing_content,
            re.DOTALL,
        )
        for m in adj_match:
            current_adjustments.append({
                "id": m[0],
                "role": m[1],
                "trigger": m[2],
                "action": m[3],
                "severity": m[4],
                "status": m[5],
            })
        print(f"  → 当前 {len(current_adjustments)} 条活跃调节")
    except (FileNotFoundError, IOError):
        print(f"  → {args.output} 不存在，新建")

    # 5. 匹配规则生成新调节
    new_adjustments = list(current_adjustments)
    matched_any = False

    for role_name in ("产品", "设计", "开发", "测试"):
        matched = match_rules(metrics, role_name)
        for rule in matched:
            matched_any = True
            val = metrics.get(rule["metric"], {}).get("cumulative", 0)
            new_adj = build_adjustment(rule, val, role_name)

            existing = [a for a in new_adjustments if a.get("trigger") == rule["name"] and a.get("role") == role_name]
            if existing:
                ex = existing[0]
                if ex.get("status") == "overridden":
                    print(f"  ∼ 跳过 {rule['name']}/{role_name}（人类已覆盖）")
                    continue

            new_adjustments = merge_adjustments(new_adjustments, new_adj)
            print(f"  {'⚠️' if rule['severity'] in ('L3','L4') else '!'} "
                  f"触发 {rule['name']}/{role_name} "
                  f"(值={val}, 阈值={rule['threshold']}, 级别={rule['severity']})")

    # 6. 过期清理
    new_adjustments, expired = expire_old_adjustments(new_adjustments)
    if expired:
        print(f"  → 过期移除 {len(expired)} 条调节")

    # 7. 写入
    if args.dry_run:
        print(f"\n🔍 Dry-run 模式，不写文件")
        print(generate_correction_blocks(new_adjustments))
        return

    write_adjustments(new_adjustments, current_inactive + expired, args.output)

    correction = generate_correction_blocks(new_adjustments)
    sync_agfile(args.agfile, correction)

    action_count = len([a for a in new_adjustments if a.get("status") in ("active", "pending_approval")])
    print(f"\n✅ 评估完成: {action_count} 条活跃调节, {len(expired)} 条过期移除")

    # 8. 写入待人类处理清单
    write_pending_human_tasks(new_adjustments)

    # 9. L3-L4 待审批提醒
    pending = [a for a in new_adjustments if a.get("status") == "pending_approval"]
    if pending:
        print(f"\n⚠️  {len(pending)} 条 L3-L4 调节待人类审批:")
        for p in pending:
            print(f"   • {p['role']}: {p['message']}")
        print(f"\n  详情见 memory/pending-human-tasks.md")


if __name__ == "__main__":
    main()
