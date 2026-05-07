#!/usr/bin/env python3
"""
scan-tools.py: 扫描 Skills / Agents / MCP 全景并生成统计报告。

用法:
  python scripts/scan-tools.py                  # 打印 CLI 摘要
  python scripts/scan-tools.py --md              # 输出 Markdown 报告到 stdout
  python scripts/scan-tools.py --md --save       # 保存 Markdown 到 docs/SCAN-REPORT.md

依赖: Python 3.9+, 无外部依赖
"""

import json
import os
import re
import sys
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path

# ─── 路径配置 ────────────────────────────────────────────────
PROJECT_ROOT = Path(__file__).resolve().parent.parent
PROJECT_SKILLS_DIR = PROJECT_ROOT / ".agents" / "skills"
GLOBAL_SKILLS_DIR = Path.home() / ".config" / "opencode" / "skills"
MCP_CONFIGS = [
    PROJECT_ROOT / ".mcp.json",
    PROJECT_ROOT / "src-next" / ".mcp.json",
]
AGENTS_DIR = PROJECT_ROOT / ".agents"
WORKBUDDY_DIR = PROJECT_ROOT / ".workbuddy"


# ─── 工具函数 ────────────────────────────────────────────────

def parse_skill_frontmatter(path: Path, project_root: Path) -> dict:
    """从 SKILL.md 中解析 YAML frontmatter (name, description)。"""
    try:
        rel = str(path.relative_to(project_root))
    except ValueError:
        rel = str(path)
    result = {
        "name": path.parent.name,
        "description": "",
        "tags": [],
        "file_path": rel,
    }
    try:
        text = path.read_text(encoding="utf-8")
        if text.startswith("---"):
            parts = text.split("---", 2)
            if len(parts) >= 3:
                frontmatter = parts[1]
                for line in frontmatter.strip().split("\n"):
                    # name:
                    m = re.match(r'^name:\s*["\']?(.+?)["\']?\s*$', line)
                    if m:
                        result["name"] = m.group(1).strip()
                    # description:
                    m = re.match(r'^description:\s*["\']?(.+?)["\']?\s*$', line)
                    if m:
                        result["description"] = m.group(1).strip()
        # 兜底：从第一行非空非 frontmatter 行取摘要
        if not result["description"]:
            lines = text.strip().split("\n")
            for line in lines:
                line = line.strip()
                if line and not line.startswith("---") and not line.startswith("#"):
                    result["description"] = line.strip("# ").strip()[:120]
                    break
    except Exception:
        pass
    return result


def infer_category(path: Path, parent_name: str, skill_name: str) -> str:
    """根据目录层级推断技能分类。"""
    # superpowers 下的子技能归类到"通用开发流程"
    if "superpowers" in str(path) and "using-superpowers" not in skill_name:
        return "通用开发流程"
    if "gitnexus" in str(path) and "guide" not in skill_name:
        return "代码库分析"
    if "gitnexus-guide" in skill_name:
        return "代码库分析"
    # 全局 skills 归类
    global_categories = {
        "accessibility": "UI/UX 设计",
        "color-theory": "UI/UX 设计",
        "web-typography": "UI/UX 设计",
        "ui-design": "UI/UX 设计",
        "ui-patterns": "UI/UX 设计",
        "responsive-design": "UI/UX 设计",
        "navigation-design": "UI/UX 设计",
        "landing-pages": "UI/UX 设计",
        "images-media": "UI/UX 设计",
        "usability": "UI/UX 设计",
        "component-patterns": "UI/UX 设计",
        "customer-journey": "用户体验",
        "ux-design": "用户体验",
        "branding-identity": "品牌与视觉",
        "visual-direction": "品牌与视觉",
        "design-process": "设计流程",
        "design-trends": "设计趋势",
        "ai-design-workflow": "AI 工作流",
        "agent-ui-design": "AI 工作流",
        "webdesign-review": "审计与质量",
        "website-audit": "审计与质量",
        "create-skills": "元技能",
    }
    # 项目 skills 归类
    project_categories = {
        "brainstorming": "通用开发流程",
        "writing-plans": "通用开发流程",
        "executing-plans": "通用开发流程",
        "subagent-driven-development": "通用开发流程",
        "dispatching-parallel-agents": "通用开发流程",
        "systematic-debugging": "通用开发流程",
        "test-driven-development": "通用开发流程",
        "requesting-code-review": "通用开发流程",
        "receiving-code-review": "通用开发流程",
        "verification-before-completion": "通用开发流程",
        "finishing-a-development-branch": "通用开发流程",
        "using-git-worktrees": "通用开发流程",
        "writing-skills": "通用开发流程",
        "using-superpowers": "调度入口",
        "gitnexus-exploring": "代码库分析",
        "gitnexus-debugging": "代码库分析",
        "gitnexus-impact-analysis": "代码库分析",
        "gitnexus-refactoring": "代码库分析",
        "gitnexus-cli": "代码库分析",
        "gitnexus-guide": "代码库分析",
        "frontend-design": "前端开发",
        "frontend-ui-animator": "前端开发",
        "frontend-ui-integration": "前端开发",
        "clone-website": "前端开发",
        "web-artifacts-builder": "前端开发",
        "shadcn-ui": "组件管理",
        "shadcn-management": "组件管理",
        "rsc-data-optimizer": "框架优化",
        "karpathy-guidelines": "编码准则",
        "squad-pre-dev-evaluation": "Squad 协作",
        "squad-post-dev-review": "Squad 协作",
        "ui-layout-rules": "UI 布局规范",
    }
    cat = global_categories.get(skill_name) or project_categories.get(skill_name)
    if cat:
        return cat
    # 按目录名兜底
    parent_str = str(path)
    if ".config/opencode/skills" in parent_str:
        return "全局技能（未分类）"
    return "项目技能（未分类）"


# ─── 扫描函数 ────────────────────────────────────────────────

def _find_skill_files(directory: Path) -> list[Path]:
    """递归寻找 SKILL.md，用 os.listdir 替代 os.walk 避免权限/符号链问题。"""
    results = []
    try:
        for entry in os.listdir(str(directory)):
            full = directory / entry
            if entry.startswith(".") or entry == "node_modules":
                continue
            if full.is_dir():
                results.extend(_find_skill_files(full))
            elif entry == "SKILL.md":
                results.append(full)
    except PermissionError:
        pass
    return results


def scan_skills(directory: Path, source_label: str) -> list[dict]:
    """递归扫描目录下所有 SKILL.md，返回技能列表。"""
    skills = []
    if not directory.exists():
        return skills
    for sk_file in _find_skill_files(directory):
        skill = parse_skill_frontmatter(sk_file, PROJECT_ROOT)
        skill["source"] = source_label
        skill["category"] = infer_category(sk_file, directory.name, skill["name"])
        try:
            skill["dir_path"] = str(sk_file.parent.relative_to(PROJECT_ROOT))
        except ValueError:
            skill["dir_path"] = str(sk_file.parent)
        skills.append(skill)
    return skills


def scan_mcp() -> list[dict]:
    """扫描所有 .mcp.json 配置。"""
    servers = []
    for cfg_path in MCP_CONFIGS:
        if not cfg_path.exists():
            continue
        try:
            data = json.loads(cfg_path.read_text(encoding="utf-8"))
            for name, info in data.get("mcpServers", {}).items():
                disabled = info.get("disabled", False)
                transport = "stdio" if "command" in info else "http"
                servers.append({
                    "name": name,
                    "transport": transport,
                    "enabled": not disabled,
                    "config_file": str(cfg_path.relative_to(PROJECT_ROOT)),
                    "command": info.get("command", info.get("url", "")),
                })
        except Exception:
            pass
    return servers


def scan_agents() -> dict:
    """扫描 .agents/ 目录结构。"""
    result = {"dirs": [], "files": [], "skills_count": 0}
    if not AGENTS_DIR.exists():
        return result
    for entry in sorted(AGENTS_DIR.rglob("*")):
        if entry.is_dir() and ".git" not in str(entry):
            rel = str(entry.relative_to(PROJECT_ROOT))
            if rel != ".agents":
                result["dirs"].append(rel)
        elif entry.is_file() and entry.suffix == ".md" and ".git" not in str(entry):
            rel = str(entry.relative_to(PROJECT_ROOT))
            result["files"].append(rel)
            if "SKILL" in entry.name:
                result["skills_count"] += 1
    return result


def scan_workbuddy() -> dict:
    """扫描 .workbuddy/memory/ 日志。"""
    result = {"log_count": 0, "logs": []}
    mem_dir = WORKBUDDY_DIR / "memory"
    if not mem_dir.exists():
        return result
    for f in sorted(mem_dir.glob("*.md")):
        result["logs"].append(f.name)
        result["log_count"] += 1
    return result


# ─── 报告生成 ────────────────────────────────────────────────

def generate_summary(project_skills: list, global_skills: list, mcps: list, agents: dict, workbuddy: dict) -> str:
    """生成 CLI 摘要。"""
    total = len(project_skills) + len(global_skills)
    categories = Counter()
    for s in project_skills + global_skills:
        categories[s["category"]] += 1

    lines = []
    lines.append("")
    lines.append("╔══════════════════════════════════════════════════╗")
    lines.append("║  Skills / Agents / MCP  全景扫描               ║")
    lines.append("╚══════════════════════════════════════════════════╝")
    lines.append("")
    lines.append(f"  📊 总览")
    lines.append(f"  {'─' * 50}")
    lines.append(f"    技能总数:     {total}  (项目 {len(project_skills)} + 全局 {len(global_skills)})")
    lines.append(f"    Agent 目录数:  {len(agents['dirs'])}")
    lines.append(f"    MCP 服务器:    {len(mcps)}")
    lines.append(f"    工作日志:      {workbuddy['log_count']} 天")
    lines.append("")
    lines.append(f"  📂 技能分类")
    lines.append(f"  {'─' * 50}")
    for cat, cnt in sorted(categories.items(), key=lambda x: -x[1]):
        bar = "━" * max(1, int(cnt * 50 / max(categories.values(), default=1)))
        lines.append(f"    {cat:14s}  {cnt:2d}  {bar}")
    lines.append("")
    lines.append(f"  🔧 MCP 服务器")
    lines.append(f"  {'─' * 50}")
    for m in mcps:
        status = "✅" if m["enabled"] else "⛔"
        lines.append(f"    {status} {m['name']:20s}  {m['transport']:6s}  {m['command'][:50]}")
    lines.append("")
    lines.append(f"  👤 Agent 角色（来自 squad-protocol）")
    lines.append(f"  {'─' * 50}")
    roles = ["组长(评估)", "产品评估员", "UI/UX评估员", "技术评估员",
             "开发交付者", "组长(验收)", "功能验收员", "代码质量验收员", "UI验收员"]
    for r in roles:
        lines.append(f"    • {r}")
    lines.append("")
    lines.append(f"  💡 提示: python scripts/scan-tools.py --md  查看完整报告")
    lines.append("")
    return "\n".join(lines)


def generate_markdown(project_skills: list, global_skills: list, mcps: list, agents: dict, workbuddy: dict) -> str:
    """生成 Markdown 报告。"""
    total = len(project_skills) + len(global_skills)
    categories = Counter()
    for s in project_skills + global_skills:
        categories[s["category"]] += 1

    lines = []
    lines.append("---")
    lines.append("title: Skills / Agents / MCP 全景扫描报告")
    lines.append(f"generated_at: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    lines.append("source_of_truth: generated")
    lines.append("---")
    lines.append("")
    lines.append(f"# Skills / Agents / MCP 全景扫描报告")
    lines.append("")
    lines.append(f"> 生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    lines.append("")

    # ── 总览 ──
    lines.append("## 📊 总览")
    lines.append("")
    lines.append(f"| 指标 | 数值 |")
    lines.append(f"|------|------|")
    lines.append(f"| 技能总数 | {total} |")
    lines.append(f"| 项目技能 | {len(project_skills)} |")
    lines.append(f"| 全局技能 | {len(global_skills)} |")
    lines.append(f"| Agent 目录数 | {len(agents['dirs'])} |")
    lines.append(f"| MCP 服务器 | {len(mcps)} |")
    lines.append(f"| 工作日志 | {workbuddy['log_count']} 天 |")
    lines.append("")

    # ── 分类统计 ──
    lines.append("## 📂 技能分类统计")
    lines.append("")
    lines.append("| 分类 | 数量 | 占比 |")
    lines.append("|------|------|------|")
    for cat, cnt in sorted(categories.items(), key=lambda x: -x[1]):
        pct = cnt / total * 100 if total else 0
        bar = "█" * max(1, int(cnt * 20 / max(categories.values(), default=1)))
        lines.append(f"| **{cat}** | {cnt} | {pct:.0f}% {bar} |")
    lines.append("")

    # ── 完整技能清单 ──
    all_skills = sorted(project_skills + global_skills, key=lambda s: (s["source"], s["category"], s["name"]))

    lines.append("## 📋 完整技能清单")
    lines.append("")
    lines.append("| # | 名称 | 来源 | 分类 | 摘要 |")
    lines.append("|---|------|------|------|------|")
    for i, s in enumerate(all_skills, 1):
        src = "项目" if s["source"] == "project" else "全局"
        desc = s["description"][:80] + ("..." if len(s["description"]) > 80 else "")
        name = f"`{s['name']}`"
        lines.append(f"| {i} | {name} | {src} | {s['category']} | {desc} |")
    lines.append("")

    # ── MCP ──
    lines.append("## 🔧 MCP 服务器")
    lines.append("")
    if mcps:
        lines.append("| 名称 | 传输方式 | 状态 | 配置来源 | 命令/URL |")
        lines.append("|------|---------|------|---------|---------|")
        for m in mcps:
            status = "✅ 启用" if m["enabled"] else "⛔ 禁用"
            lines.append(f"| `{m['name']}` | {m['transport']} | {status} | `{m['config_file']}` | `{m['command'][:60]}` |")
    else:
        lines.append("_无 MCP 配置_")
    lines.append("")

    # ── Agent 角色 ──
    lines.append("## 👤 Agent 角色（Squad 协议）")
    lines.append("")
    lines.append("| 角色 | 所属组 | 模型 | 职责 |")
    lines.append("|------|--------|------|------|")
    role_data = [
        ("组长", "评估组", "v4-pro", "调度评估、汇总意见、仲裁分歧、输出设计文档"),
        ("产品评估员", "评估组", "v4-flash", "评估需求合理性、用户场景、功能价值"),
        ("UI/UX 评估员", "评估组", "v4-flash", "评估设计规范一致性、交互模式、可访问性"),
        ("技术评估员", "评估组", "v4-pro", "评估技术可行性、影响范围、输出测试策略"),
        ("开发交付者", "执行", "v4-pro", "按计划开发、TDD、自检、日志/PR 收尾"),
        ("组长", "验收组", "v4-pro", "调度验收、汇总意见、给出结论"),
        ("功能验收员", "验收组", "v4-flash", "需求覆盖、边界条件、E2E 验证"),
        ("代码质量验收员", "验收组", "v4-pro", "编码规范、架构合规、死代码检查"),
        ("UI 验收员", "验收组", "v4-flash", "代码审查：色值/状态/暗色/响应式/可访问性"),
    ]
    for role, group, model, desc in role_data:
        lines.append(f"| **{role}** | {group} | `{model}` | {desc} |")
    lines.append("")

    # ── 技能目录结构 ──
    lines.append("## 📁 技能目录结构")
    lines.append("")
    lines.append("```")
    lines.append(".agents/skills/")
    # 按分类分组
    cat_dirs = defaultdict(list)
    for s in sorted(project_skills, key=lambda x: x["name"]):
        cat_dirs[s["category"]].append(s["name"])
    for cat, names in sorted(cat_dirs.items()):
        lines.append(f"  # {cat} ({len(names)})")
        for n in names:
            lines.append(f"  ├── {n}/")
    lines.append("```")
    lines.append("")

    # ── 工作日志 ──
    lines.append(f"## 📝 工作日志（{workbuddy['log_count']} 天）")
    lines.append("")
    if workbuddy["logs"]:
        lines.append("| 日期 | 日志 |")
        lines.append("|------|------|")
        for log in workbuddy["logs"]:
            date_str = log.replace(".md", "")
            lines.append(f"| {date_str} | `.workbuddy/memory/{log}` |")
    lines.append("")

    # ── 推荐命令 ──
    lines.append("## 💡 常用命令")
    lines.append("")
    lines.append("```bash")
    lines.append("# 刷新本报告")
    lines.append("python scripts/scan-tools.py --md --save")
    lines.append("")
    lines.append("# 查看 CLI 摘要")
    lines.append("python scripts/scan-tools.py")
    lines.append("```")
    lines.append("")

    return "\n".join(lines)


# ─── CLI 入口 ────────────────────────────────────────────────

def main():
    args = set(sys.argv[1:])
    save = "--save" in args
    md = "--md" in args

    print("🔍 正在扫描...", file=sys.stderr)

    project_skills = scan_skills(PROJECT_SKILLS_DIR, "project")
    global_skills = scan_skills(GLOBAL_SKILLS_DIR, "global")
    mcps = scan_mcp()
    agents = scan_agents()
    workbuddy = scan_workbuddy()

    print(f"   ✅ 项目技能: {len(project_skills)}", file=sys.stderr)
    print(f"   ✅ 全局技能:  {len(global_skills)}", file=sys.stderr)
    print(f"   ✅ MCP 服务器: {len(mcps)}", file=sys.stderr)
    print(f"   ✅ Agent 目录: {len(agents['dirs'])}", file=sys.stderr)
    print(f"   ✅ 工作日志:   {workbuddy['log_count']} 天", file=sys.stderr)

    if md or save:
        report = generate_markdown(project_skills, global_skills, mcps, agents, workbuddy)
        if save:
            output_path = PROJECT_ROOT / "docs" / "SCAN-REPORT.md"
            output_path.write_text(report, encoding="utf-8")
            print(f"\n📄 报告已保存: {output_path.relative_to(PROJECT_ROOT)}", file=sys.stderr)
        if md:
            print(report)
    else:
        print(generate_summary(project_skills, global_skills, mcps, agents, workbuddy))


if __name__ == "__main__":
    main()
