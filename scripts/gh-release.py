#!/usr/bin/env python3
"""
gh-release.py: Create a GitHub release with changelog from closed milestone issues.

Usage:
  python scripts/gh-release.py --milestone "M1 - Phase 1 底座搭建"
  python scripts/gh-release.py --milestone "Phase 2" --tag v2.0.0

Requires:
  - gh CLI authenticated
  - All milestone issues should be closed
"""

import json
import subprocess
import sys


def run_gh(cmd: list[str]) -> str:
    result = subprocess.run(["gh"] + cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"⚠  Error: {result.stderr.strip()}")
        sys.exit(1)
    return result.stdout.strip()


def get_milestone_number(title: str) -> str | None:
    """Find milestone number by title (partial match)."""
    result = run_gh(["milestone", "list", "--json", "number,title"])
    for ms in json.loads(result):
        if title.lower() in ms["title"].lower():
            return str(ms["number"])
    return None


def get_closed_issues(milestone_num: str):
    """Get all closed issues for a milestone."""
    result = run_gh([
        "issue", "list",
        "--milestone", milestone_num,
        "--state", "closed",
        "--json", "number,title,labels",
        "--limit", "50",
    ])
    return json.loads(result)


def get_open_issues(milestone_num: str):
    """Get all open issues for a milestone."""
    result = run_gh([
        "issue", "list",
        "--milestone", milestone_num,
        "--state", "open",
        "--json", "number,title",
        "--limit", "50",
    ])
    return json.loads(result)


def generate_changelog(issues: list) -> str:
    """Generate markdown changelog from issues grouped by type."""
    groups = {
        "feature": [],
        "bug": [],
        "refactor": [],
        "docs": [],
        "test": [],
        "infra": [],
    }

    for issue in issues:
        issue_type = "feature"
        for label in issue.get("labels", []):
            name = label["name"]
            if name.startswith("type:"):
                issue_type = name.split(":")[1]
                break
        if issue_type not in groups:
            issue_type = "feature"
        groups[issue_type].append(issue)

    label_names = {
        "feature": "✨ 新功能",
        "bug": "🐛 缺陷修复",
        "refactor": "🔧 重构与优化",
        "docs": "📖 文档",
        "test": "🧪 测试",
        "infra": "⚙️ 基础设施",
    }

    changelog = ""
    for type_key, type_label in label_names.items():
        if groups[type_key]:
            changelog += f"\n### {type_label}\n\n"
            for issue in groups[type_key]:
                changelog += f"- #{issue['number']} {issue['title']}\n"

    return changelog


def main():
    if "--milestone" not in sys.argv:
        print(__doc__)
        sys.exit(1)

    idx = sys.argv.index("--milestone")
    ms_title = sys.argv[idx + 1]

    # Default tag name from milestone
    tag = None
    if "--tag" in sys.argv:
        tag_idx = sys.argv.index("--tag")
        tag = sys.argv[tag_idx + 1]

    # Find milestone
    print(f"Looking up milestone: {ms_title}")
    ms_num = get_milestone_number(ms_title)
    if not ms_num:
        print(f"Milestone not found: {ms_title}")
        sys.exit(1)
    print(f"Milestone number: {ms_num}")

    # Check for open issues
    open_issues = get_open_issues(ms_num)
    if open_issues:
        print(f"\n⚠  Warning: {len(open_issues)} issues still open in milestone:")
        for issue in open_issues:
            print(f"  #{issue['number']} {issue['title']}")
        proceed = input("\nContinue anyway? (y/N): ")
        if proceed.lower() != "y":
            print("Aborted.")
            sys.exit(0)

    # Get closed issues
    closed = get_closed_issues(ms_num)
    print(f"\nClosed issues: {len(closed)}")

    if not closed:
        print("No closed issues found for this milestone.")
        sys.exit(1)

    # Generate changelog
    changelog = generate_changelog(closed)
    tag_name = tag or f"v{ms_title.split()[0].lower().lstrip('m')}.0.0"

    release_body = f"# {ms_title}\n\n{changelog}\n"

    print(f"\n=== Release Preview: {tag_name} ===\n")
    print(release_body)

    # Confirm
    confirm = input("\nCreate this release? (y/N): ")
    if confirm.lower() != "y":
        print("Aborted.")
        sys.exit(0)

    # Create git tag
    subprocess.run(["git", "tag", "-a", tag_name, "-m", f"Release {tag_name}"], check=True)
    subprocess.run(["git", "push", "origin", tag_name], check=True)

    # Create GitHub Release
    run_gh([
        "release", "create", tag_name,
        "--title", f"{ms_title} - {tag_name}",
        "--notes", release_body,
    ])

    print(f"\n✓ Release {tag_name} created!")


if __name__ == "__main__":
    main()
