---
name: executing-plans
description: Use when you have a written implementation plan to execute - loads plan, executes tasks with verification, and completes development
---

# Executing Plans

## Overview

Load plan, review critically, execute all tasks, report when complete.

**Announce at start:** "I'm using the executing-plans skill to implement this plan."

## The Process

### Step 1: Load and Review Plan

1. Read plan file
2. Review critically - identify any questions or concerns
3. If concerns: Raise them before starting
4. If no concerns: Create TodoWrite and proceed

### Step 2: Execute Tasks

For each task:

1. Mark as in_progress
2. Follow each step exactly
3. Run verifications as specified
4. Mark as completed

### Step 3: Complete Development

After all tasks complete and verified:

- Announce: "I'm using the finishing-a-development-branch skill to complete this work."
- Use superpowers:finishing-a-development-branch

## When to Stop and Ask for Help

**STOP when:**

- Hit a blocker (missing dependency, test fails, unclear instruction)
- Plan has critical gaps
- You don't understand an instruction
- Verification fails repeatedly

## Remember

- Review plan critically first
- Follow plan steps exactly
- Don't skip verifications
- Stop when blocked, don't guess
