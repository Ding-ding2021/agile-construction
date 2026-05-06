---
name: finishing-a-development-branch
description: Use when implementation is complete, all tests pass, and you need to decide how to integrate the work - guides completion by presenting structured options for merge, PR, or cleanup
---

# Finishing a Development Branch

## Overview

Guide completion of development work by presenting clear options and handling chosen workflow.

**Core principle:** Verify tests → Detect environment → Present options → Execute choice → Clean up.

## The Process

### Step 1: Verify Tests

Run the project's test suite. If tests fail, stop and fix before proceeding.

### Step 2: Detect Environment

Determine workspace state (normal repo vs worktree) to show the correct menu.

### Step 3: Determine Base Branch

Find the base branch (main/master) for merge target.

### Step 4: Present Options

```
Implementation complete. What would you like to do?

1. Merge back to <base-branch> locally
2. Push and create a Pull Request
3. Keep the branch as-is (I'll handle it later)
4. Discard this work
```

### Step 5: Execute Choice

Execute the chosen option (merge, PR, keep, or discard with confirmation).

### Step 6: Cleanup Workspace

Clean up worktree only for Options 1 and 4. Preserve for Options 2 and 3.

## Red Flags

**Never:**

- Proceed with failing tests
- Merge without verifying tests on result
- Delete work without confirmation
- Force-push without explicit request
- Clean up worktrees you didn't create
