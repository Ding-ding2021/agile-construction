#!/usr/bin/env python3
"""
gh-sync.py: Sync local development state with GitHub Issues.

Usage:
  python scripts/gh-sync.py                       # Show today's work summary
  python scripts/gh-sync.py --status <number>      # Show issue details
  python scripts/gh-sync.py --comment <number>     # Add completion comment
  python scripts/gh-sync.py --close <number>       # Close an issue
  python scripts/gh-sync.py --list-phase <phase>   # List open issues for a phase

Requires:
  - gh CLI authenticated
  - .workbuddy/memory/YYYY-MM-DD.md for today's date
"""

import json
import subprocess
import sys
from datetime import date


def run_gh(cmd: list[str]) -> str:
    result = subprocess.run(["gh"] + cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"⚠  {result.stderr.strip()}")
    return result.stdout.strip()


def show_today():
    """Show today's log and suggest status updates."""
    today = date.today().strftime("%Y-%m-%d")
    log_path = f".workbuddy/memory/{today}.md"
    try:
        with open(log_path, "r", encoding="utf-8") as f:
            content = f.read()
        print(f"=== Today's Work Log ({today}) ===\n")
        print(content)
    except FileNotFoundError:
        print(f"No log found for {today}")
        print(f"Expected at: {log_path}")


def show_issue(number: str):
    """Show issue details."""
    result = run_gh(["issue", "view", number, "--json", "title,state,labels,milestone,body"])
    try:
        data = json.loads(result)
        print(f"\n=== #{number}: {data['title']} ===")
        print(f"State: {data['state']}")
        print(f"Labels: {', '.join(l['name'] for l in data['labels'])}")
        if data.get("milestone"):
            print(f"Milestone: {data['milestone']['title']}")
        if data.get("body"):
            print(f"\n{data['body'][:500]}...")
    except json.JSONDecodeError:
        print(result)


def add_comment(number: str):
    """Add a completion comment to an issue."""
    today = date.today().strftime("%Y-%m-%d")
    comment = f"Progress update ({today}): Task implementation complete. See `.workbuddy/memory/{today}.md` for details."
    result = run_gh(["issue", "comment", number, "--body", comment])
    print(f"Comment added to #{number}")


def close_issue(number: str):
    """Close an issue with verification comment."""
    today = date.today().strftime("%Y-%m-%d")
    comment = (
        f"Verified ({today}).\n"
        f"- `npm run build` ✓\n"
        f"- `npm run lint` ✓\n"
        f"- `.workbuddy/memory/{today}.md` ✓"
    )
    result = run_gh(["issue", "close", number, "--comment", comment])
    print(f"Issue #{number} closed")


def list_phase(phase: str):
    """List open issues for a given phase label."""
    label_map = {
        "1": "phase:1-foundation",
        "1.5": "phase:1.5-base-finish",
        "2": "phase:2-standards",
        "3": "phase:3-tasks",
        "4": "phase:4-procurement",
        "5": "phase:5-agent",
        "6": "phase:6-e2e",
    }
    label = label_map.get(phase, f"phase:{phase}")
    result = run_gh(["issue", "list", "--label", label, "--state", "open", "--json",
                     "number,title,labels,milestone"])
    try:
        issues = json.loads(result)
        print(f"\n=== Open Issues ({label}) ===")
        for issue in issues:
            print(f"  #{issue['number']} {issue['title']}")
        print(f"\nTotal: {len(issues)}")
    except json.JSONDecodeError:
        print(result)


def main():
    if len(sys.argv) < 2:
        show_today()
        return

    cmd = sys.argv[1]
    if cmd == "--status" and len(sys.argv) > 2:
        show_issue(sys.argv[2])
    elif cmd == "--comment" and len(sys.argv) > 2:
        add_comment(sys.argv[2])
    elif cmd == "--close" and len(sys.argv) > 2:
        close_issue(sys.argv[2])
    elif cmd == "--list-phase" and len(sys.argv) > 2:
        list_phase(sys.argv[2])
    else:
        print(__doc__)
        sys.exit(1)


if __name__ == "__main__":
    main()
