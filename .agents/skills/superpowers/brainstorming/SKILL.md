---
name: brainstorming
description: Use when starting ANY new feature, project, or significant change - guides turning vague ideas into concrete designs through structured exploration before writing code
---

# Brainstorming

## Overview

Turn vague ideas into concrete designs before writing code. You explore context, ask targeted questions, propose approaches, and write a spec. Only after user approval does implementation begin.

**Hard gate:** No code or implementation work until a design is presented and approved by the user. "It's too simple for a spec" means "I don't understand it well enough to spec it."

**This applies to EVERY project regardless of perceived simplicity.**

## When to Use

**Always when starting anything new:**

- New features, projects, or subsystems
- Significant refactoring or redesign
- Architecture decisions
- When user request is ambiguous

**Never skip because:**

- "It's simple" — simple things have hidden complexity
- "I understand what they want" — understanding ≠ alignment
- "We already discussed this" — write it down anyway

## The Process

### Step 1: Explore Project Context

Before proposing anything:

- Review relevant files, existing architecture
- Check recent commits for direction
- Look for related specs or docs
- Understand the codebase conventions

### Step 2: Ask Clarifying Questions

One at a time. Prefer multiple choice. Cover:

- Goal: What problem are we solving?
- Constraints: What must we preserve?
- Success: How will we know it works?
- Scope: What's in and what's out?

### Step 3: Propose Approaches

Present 2-3 approaches with trade-offs and a recommendation.

### Step 4: Present Design

In sections, getting approval after each. Cover:

- Architecture and component structure
- Data flow and state management
- User-facing changes
- Testing strategy

### Step 5: Write Design Doc

Save to `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` and commit.

### Step 6: Spec Self-Review

Check for: missing sections, placeholders, contradictions, unclear scope, assumptions not validated.

### Step 7: Transition

Wait for user approval, then invoke `writing-plans` skill.

## Key Principles

- One question at a time
- Prefer multiple choice over open-ended
- YAGNI: propose simplest viable approach
- Validate incrementally
- Decompose large projects into independent sub-projects

## Red Flags

- Starting implementation without spec
- Skipping steps because "it's simple"
- Multiple questions at once
- Vague design that can't be reviewed
