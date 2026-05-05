---
name: requesting-code-review
description: Use when completing tasks, implementing major features, or before merging to verify work meets requirements
---

# Requesting Code Review

Dispatch a code reviewer subagent to catch issues before they cascade.

**Core principle:** Review early, review often.

## When to Request Review

**Mandatory:**

- After each task in subagent-driven development
- After completing major feature
- Before merge to main

**Optional but valuable:**

- When stuck (fresh perspective)
- Before refactoring (baseline check)
- After fixing complex bug

## How to Request

1. Get git SHAs for the changes
2. Dispatch code reviewer subagent with:
   - Description of what was built
   - Plan or requirements
   - Base and head commit SHAs
3. Act on feedback:
   - Fix Critical issues immediately
   - Fix Important issues before proceeding
   - Note Minor issues for later
   - Push back if reviewer is wrong (with reasoning)

## Red Flags

**Never:**

- Skip review because "it's simple"
- Ignore Critical issues
- Proceed with unfixed Important issues
- Argue with valid technical feedback
