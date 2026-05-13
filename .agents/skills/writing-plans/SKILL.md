---
name: writing-plans
description: Use when creating implementation plans from specs or requirements - breaks work into bite-sized tasks with complete code and verification steps
---

# Writing Plans

## Overview

Create implementation plans from specs with structured, actionable tasks.

**Announce at start:** "I'm using the writing-plans skill."

## Scope Check

If a spec spans multiple independent subsystems, break into separate plans.

## Task Granularity

Each step is one action (2-5 minutes):

- Write a failing test
- Run to verify failure
- Implement
- Run to verify pass
- Commit

## Plan Format

Required header with: goal, architecture, tech stack.

Each task includes:

- Exact file paths (create/modify/test)
- Checklist steps with complete code blocks
- Run commands showing expected output
- A commit step

**No Placeholders Rule:** "TBD", "TODO", "implement later" are plan failures.

## Self-Review

After writing:

- Check spec coverage
- Scan for placeholders
- Verify type consistency across tasks

## Execution Handoff

Two options:

- Subagent-Driven (fresh agent per task, recommended)
- Inline Execution (same session with checkpoints)
