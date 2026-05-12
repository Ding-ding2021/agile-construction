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
import os
import re
import sys
from datetime import datetime, timedelta


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
]


# ============================================================
# 解析器
# ============================================================

def parse_self_check_blocks(content):
    """从 daily log 的自检块提取违规数据"""
    violations = {}
    pattern = r"\| 避坑 \|(.+?)\|"
    for m in re.finditer(pattern, content):
        text = m.group(1)
        for item in re.findall(r"(\D+?)\s*(\d+)\s*次?", text):
            name = item[0].strip().lstrip("/").strip()
            count = int(item[1])
            if count > 0 and name:
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
    if not active:
        return "<!-- 当前无活跃矫正指令 -->\n"

    lines = []
    lines.append("<!-- ADJUSTMENTS-START -->")
    lines.append("<!-- 以下为 harness 自动注入的行为矫正指令，基于近期指标表现 -->")
    lines.append("<!-- 如需手动覆盖，请将对应条目的 status 改为 overridden -->")
    lines.append("")
    for adj in active:
        status_tag = "⚠️ " if adj["status"] == "pending_approval" else ""
        if adj.get("severity", "L1") in ("L3", "L4"):
            force = adj["params"].get("mode", "mandatory") if isinstance(adj.get("params"), dict) else "mandatory"
            reason = f"  <!-- severity: {adj['severity']}, 待人类审批 -->"
        else:
            force = adj["params"].get("mode", "mandatory") if isinstance(adj.get("params"), dict) else "mandatory"
            reason = f""
        lines.append(f"### {status_tag}会话级矫正（{adj['applied']} ~ {adj['expires']}）")
        lines.append(f"- [ ] **{adj['role']}**：{adj['message']}")
        if reason:
            lines.append(reason)
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

    # 检查是否已有标记段
    if start_marker in content and end_marker in content:
        pattern = re.compile(
            re.escape(start_marker) + r".*?" + re.escape(end_marker),
            re.DOTALL,
        )
        new_content = pattern.sub(correction_text, content)
    else:
        # 在"启动清单"之后、"语言铁律"之前插入
        insert_point = "## 启动清单（不可跳过，逐项执行）"
        if insert_point in content:
            # 找启动清单的结束，在"语言铁律"之前
            lang_point = "## 语言铁律"
            if lang_point in content:
                new_content = content.replace(
                    lang_point,
                    correction_text + "\n\n" + lang_point,
                    1,
                )
            else:
                new_content = content + "\n\n" + correction_text
        else:
            new_content = correction_text

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


def main():
    parser = argparse.ArgumentParser(description="Harness 自适应评估引擎")
    parser.add_argument("--days", type=int, default=14, help="分析窗口（天）")
    parser.add_argument("--output", default=".harness/adjustments.yaml", help="调节输出路径")
    parser.add_argument("--agfile", default="AGENTS.md", help="AGENTS.md 路径")
    parser.add_argument("--dry-run", action="store_true", help="仅预览不写文件")
    args = parser.parse_args()

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

    # 3. 计算聚合指标
    metrics = compute_averages(all_violations, args.days)
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

    # 8. L3-L4 待审批提醒
    pending = [a for a in new_adjustments if a.get("status") == "pending_approval"]
    if pending:
        print(f"\n⚠️  {len(pending)} 条 L3-L4 调节待人类审批:")
        for p in pending:
            print(f"   • {p['role']}: {p['message']}")
        print("\n  飞书审批表单待集成（当前阶段：生成审批待办文件）")
        pending_path = args.output.replace(".yaml", "-pending.json")
        import json as _json
        with open(pending_path, "w") as pf:
            _json.dump(pending, pf, indent=2, ensure_ascii=False)
        print(f"  审批待办已写入 {pending_path}")


if __name__ == "__main__":
    main()
