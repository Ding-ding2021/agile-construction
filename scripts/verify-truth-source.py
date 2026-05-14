#!/usr/bin/env python3
"""真相源同步校验器 — 验证 registry.yaml/manifest.yaml/role files 一致性"""

import os
import sys
import yaml

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REGISTRY_PATH = os.path.join(REPO_ROOT, ".harness/registry.yaml")
MANIFEST_PATH = os.path.join(REPO_ROOT, ".harness/manifest.yaml")


def fail(msg):
    print(f"  ❌ {msg}")
    return 1


def warn(msg):
    print(f"  ⚠️  {msg}")
    return 0


def ok(msg):
    print(f"  ✅ {msg}")
    return 0


def check_role_files(registry):
    """检查注册表中引用的角色文件是否存在"""
    issues = 0

    conflicts = []
    for role in registry.get("roles", []):
        path = role.get("role_file", "")
        full_path = os.path.join(REPO_ROOT, path)
        if not os.path.exists(full_path):
            issues += fail(f"角色文件缺失: {path}")
        else:
            ok(f"角色文件存在: {path}")

    return issues


def check_context_role_files(registry):
    """检查 context.role_files 与 roles.role_file 是否一致"""
    issues = 0

    name_map = {
        "产品经理": "产品",
        "UI设计师": "设计",
        "开发工程师": "开发",
        "测试工程师": "测试",
    }
    roles_map = {}
    for r in registry.get("roles", []):
        full_name = r["name"]
        short_name = name_map.get(full_name, full_name)
        roles_map[short_name] = r.get("role_file", "")

    ctx_roles = registry.get("context", {}).get("role_files", {})

    for short_name, expected_path in roles_map.items():
        ctx_path = ctx_roles.get(short_name)
        if ctx_path is None:
            issues += fail(f"context.role_files 缺少角色: {short_name}")
        elif ctx_path != expected_path:
            issues += fail(
                f"角色文件路径不一致: context.role_files[{short_name}]={ctx_path} vs roles[{short_name}].role_file={expected_path}"
            )
        else:
            ok(f"角色文件路径一致: {short_name} → {expected_path}")

    return issues


def check_skill_counts(registry, manifest):
    """检查技能数量是否一致"""
    issues = 0

    all_skills = set()
    skill_data = registry.get("skills", {})
    for _role_name, data in skill_data.items():
        if isinstance(data, dict):
            for s in data.get("exclusive", []):
                all_skills.add(s)
            for s in data.get("pending_assignment", []):
                all_skills.add(s)
        elif isinstance(data, list):
            for s in data:
                all_skills.add(s)

    actual_total = len(all_skills)
    manifest_total = manifest.get("skills_total", 0)

    if actual_total != manifest_total:
        issues += fail(
            f"技能总数不一致: manifest.yaml skills_total={manifest_total}, 实际去重 exclusive 技能={actual_total}"
        )
    else:
        ok(f"技能总数一致: {actual_total}")

    roles_in_manifest = {p["name"]: p.get("skills", 0) for p in manifest.get("professions", [])}
    for r in registry.get("roles", []):
        name = r["name"]
        registry_count = r.get("skills", 0)
        manifest_count = roles_in_manifest.get(name, 0)
        if registry_count != manifest_count:
            issues += warn(f"{name} 技能数不一致: registry={registry_count}, manifest={manifest_count}")
        else:
            ok(f"{name} 技能数一致: {registry_count}")

    return issues


def check_missing_entries(registry, manifest):
    """检查关键字段是否存在"""
    issues = 0

    checks = [
        ("registry.roles", registry.get("roles"), "列表非空"),
        ("registry.skills", registry.get("skills"), "字典非空"),
        ("registry.governance", registry.get("governance"), "字典非空"),
        ("registry.metrics", registry.get("governance", {}).get("metrics"), "字典非空"),
        ("manifest.phases", manifest.get("phases"), "列表非空"),
        ("manifest.professions", manifest.get("professions"), "列表非空"),
        ("manifest.skills_total", manifest.get("skills_total"), "整数"),
    ]

    for label, value, expected in checks:
        if not value:
            issues += fail(f"{label} 缺失或为空 (期望: {expected})")
        else:
            ok(f"{label}: {expected}")

    return issues


def check_phase_consistency(registry, manifest):
    """检查阶段定义一致"""
    issues = 0
    reg_phases = [p["id"] for p in registry.get("workflows", {}).get("phases", [])]
    man_phases = manifest.get("phases", [])

    if reg_phases != man_phases:
        issues += fail(f"阶段不一致: registry={reg_phases} vs manifest={man_phases}")
    else:
        ok(f"阶段一致: {reg_phases}")

    return issues


def main():
    print("🔍 真相源同步校验")
    print(f"   注册表: {REGISTRY_PATH}")
    print(f"   元描述: {MANIFEST_PATH}")
    print()

    if not os.path.exists(REGISTRY_PATH):
        print(f"❌ {REGISTRY_PATH} 不存在")
        return 1
    if not os.path.exists(MANIFEST_PATH):
        print(f"❌ {MANIFEST_PATH} 不存在")
        return 1

    with open(REGISTRY_PATH) as f:
        registry = yaml.safe_load(f)
    with open(MANIFEST_PATH) as f:
        manifest = yaml.safe_load(f)

    total_issues = 0

    print("1. 角色文件可用性")
    total_issues += check_role_files(registry)
    print()

    print("2. 角色文件路径一致性 (context.role_files vs roles.role_file)")
    total_issues += check_context_role_files(registry)
    print()

    print("3. 技能数量一致性")
    total_issues += check_skill_counts(registry, manifest)
    print()

    print("4. 关键字段完整性")
    total_issues += check_missing_entries(registry, manifest)
    print()

    print("5. 阶段定义一致性")
    total_issues += check_phase_consistency(registry, manifest)
    print()

    if total_issues == 0:
        print("✅ 真相源同步校验全部通过！")
        return 0
    else:
        print(f"❌ 发现 {total_issues} 个问题")
        return 1


if __name__ == "__main__":
    sys.exit(main())
