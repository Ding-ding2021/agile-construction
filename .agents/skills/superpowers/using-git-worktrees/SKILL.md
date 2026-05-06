---
name: using-git-worktrees
description: Use when starting feature work that needs isolation from current workspace or before executing implementation plans
---

# Using Git Worktrees

## Overview

Ensure work happens in an isolated workspace.

## Step 0: Detect Existing Isolation

Check if already in an isolated workspace. If yes, skip creation.

## Step 1: Create Isolated Workspace

Two mechanisms, try in this order:

### 1a. Native Worktree Tools (preferred)

Use platform's native worktree tool if available (e.g., EnterWorktree).

### 1b. Git Worktree Fallback

Only if no native tool available. Create a worktree using git.

## Step 3: Project Setup

Auto-detect and run appropriate setup (npm install, etc.).

## Step 4: Verify Clean Baseline

Run tests to ensure workspace starts clean.

## Quick Reference

| Situation                      | Action                |
| ------------------------------ | --------------------- |
| Already in linked worktree     | Skip creation         |
| Native worktree tool available | Use it                |
| No native tool                 | Git worktree fallback |
| Sandbox blocks create          | Work in place         |

## Red Flags

- Creating worktree when already isolated
- Using git worktree when native tool exists
- Skipping baseline test verification
- Proceeding with failing tests without asking
