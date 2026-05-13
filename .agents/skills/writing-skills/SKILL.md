---
name: writing-skills
description: Use when creating or modifying Superpowers skills - follows TDD approach to skill development
---

# Writing Skills

## Overview

Writing skills IS Test-Driven Development applied to process documentation.

**Iron Law:** NO SKILL WITHOUT A FAILING TEST FIRST.

## The Process (RED-GREEN-REFACTOR)

### RED — Run pressure scenario with a subagent WITHOUT the skill

Document failures and rationalizations verbatim.

### GREEN — Write minimal skill addressing those specific failures

### REFACTOR — Close loopholes by capturing new rationalizations

## Description Field

Must use "Use when…" format. Describe triggering conditions only — never summarize the skill's workflow.

## Skill Types

| Type      | Purpose                    | Example                 |
| --------- | -------------------------- | ----------------------- |
| Technique | Concrete method with steps | condition-based-waiting |
| Pattern   | Way of thinking            | flatten-with-flags      |
| Reference | API docs, syntax guides    | pptx                    |

## File Structure

```
skills/skill-name/
  SKILL.md              # Required
  supporting-file.*     # Only if needed
```

## Token Efficiency

Frequently-loaded skills target <200 words. Others aim <500.

## Bulletproofing

- Close every loophole
- Add foundational principle
- Build rationalization table from baseline testing
- Create red flags list for self-checking
