---
name: subagent-driven-development
description: Use when executing implementation plans with subagent support - dispatches fresh subagents per task with two-stage review (spec compliance then code quality)
---

# Subagent-Driven Development

## Overview

Execute implementation plans by dispatching fresh subagents per task with two-stage review.

**Core principle:** Fresh subagent per task + two-stage review (spec then quality) = high quality, fast iteration.

## Continuous Execution

Do not pause to check in with your human partner between tasks. Tasks execute sequentially.

## Process Flow

1. Read the plan and extract all tasks
2. For each task, dispatch an **implementer subagent**
3. If the implementer asks questions, answer them before proceeding
4. Dispatch a **spec compliance reviewer** — verify code matches requirements
5. If spec issues found, implementer fixes them, then re-review
6. Dispatch a **code quality reviewer** for approval
7. If quality issues found, implementer fixes them, then re-review
8. Mark task complete, proceed to next
9. After all tasks, dispatch final code reviewer for entire implementation

## Implementer Status Handling

- **DONE** — proceed to spec review
- **DONE_WITH_CONCERNS** — read concerns first
- **NEEDS_CONTEXT** — provide info and re-dispatch
- **BLOCKED** — assess blocker

## Red Flags

- Never skip either spec compliance or code quality review
- Never dispatch multiple implementation subagents in parallel
- Never make a subagent read the plan file directly
- Never start code quality review before spec compliance is approved
- Never move to next task while either review has open issues
