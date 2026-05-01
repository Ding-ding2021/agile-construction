#!/usr/bin/env python3
"""
gh-setup.py: Initialize/update GitHub project management structure.

Usage:
  python scripts/gh-setup.py --init          # Create labels, milestones, issues
  python scripts/gh-setup.py --labels        # Sync labels from plan-issues.json
  python scripts/gh-setup.py --milestones    # Sync milestones from plan-issues.json
  python scripts/gh-setup.py --issues        # Batch create issues from plan-issues.json

Requires:
  - gh CLI authenticated
  - scripts/plan-issues.json as source of truth
"""

import json
import subprocess
import sys
import os

PLAN_FILE = os.path.join(os.path.dirname(__file__), "plan-issues.json")


def load_plan():
    with open(PLAN_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def run_gh(cmd: list[str], desc: str = "") -> str:
    """Run a gh CLI command and return stdout."""
    full_cmd = ["gh"] + cmd
    print(f"  → {desc or ' '.join(cmd)}")
    result = subprocess.run(full_cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"  ⚠  stderr: {result.stderr.strip()}")
    return result.stdout.strip()


def setup_labels(plan: dict):
    """Create all labels defined in plan-issues.json."""
    print("\n=== Creating Labels ===")
    existing = run_gh(["label", "list", "--json", "name"], "fetch existing labels")
    existing_names = set()
    if existing:
        try:
            existing_names = {item["name"] for item in json.loads(existing)}
        except json.JSONDecodeError:
            pass

    for label in plan["labels"]:
        if label["name"] in existing_names:
            print(f"  SKIP {label['name']} (already exists)")
            continue
        run_gh([
            "label", "create", label["name"],
            "--color", label["color"],
            "--description", label["description"],
        ], f"create label {label['name']}")

    print(f"  ✓ {len(plan['labels'])} labels processed")


def setup_milestones(plan: dict):
    """Create all milestones defined in plan-issues.json."""
    print("\n=== Creating Milestones ===")
    existing = run_gh(["milestone", "list", "--json", "title"], "fetch existing milestones")
    existing_titles = set()
    if existing:
        try:
            existing_titles = {item["title"] for item in json.loads(existing)}
        except json.JSONDecodeError:
            pass

    for ms in plan["milestones"]:
        if ms["title"] in existing_titles:
            print(f"  SKIP {ms['title']} (already exists)")
            continue
        run_gh([
            "milestone", "create", ms["title"],
            "--description", ms["description"],
        ], f"create milestone {ms['title']}")

    print(f"  ✓ {len(plan['milestones'])} milestones processed")


def create_issues(plan: dict):
    """Batch create issues from plan-issues.json."""
    print("\n=== Creating Issues ===")

    # Get milestone ID mapping
    ms_result = run_gh(["milestone", "list", "--json", "title,number"], "fetch milestones")
    ms_map = {}
    if ms_result:
        try:
            for ms in json.loads(ms_result):
                ms_map[ms["title"]] = ms["number"]
        except json.JSONDecodeError:
            pass

    # List existing issues to avoid duplicates
    existing = run_gh(["issue", "list", "--state", "all", "--json", "title", "--limit", "100"],
                      "fetch existing issues")
    existing_titles = set()
    if existing:
        try:
            existing_titles = {item["title"] for item in json.loads(existing)}
        except json.JSONDecodeError:
            pass

    created = 0
    skipped = 0
    for issue in plan["issues"]:
        if issue["title"] in existing_titles:
            print(f"  SKIP {issue['title']} (already exists)")
            skipped += 1
            continue

        cmd = [
            "issue", "create",
            "--title", issue["title"],
            "--label", ",".join(issue["labels"]),
            "--body", issue.get("body", issue["title"]),
        ]

        ms_id = ms_map.get(issue.get("milestone", ""))
        if ms_id:
            cmd.extend(["--milestone", str(ms_id)])

        run_gh(cmd, f"create issue {issue['title']}")
        created += 1

    print(f"  ✓ {created} created, {skipped} skipped")


def main():
    plan = load_plan()

    if "--init" in sys.argv:
        setup_labels(plan)
        setup_milestones(plan)
        create_issues(plan)
        print("\n=== Setup complete! ===")
    elif "--labels" in sys.argv:
        setup_labels(plan)
    elif "--milestones" in sys.argv:
        setup_milestones(plan)
    elif "--issues" in sys.argv:
        create_issues(plan)
    else:
        print(__doc__)
        sys.exit(1)


if __name__ == "__main__":
    main()
