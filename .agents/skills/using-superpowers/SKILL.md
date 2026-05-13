---
name: using-superpowers
description: Use before responding to any user request - checks if any superpowers skill might apply and invokes it
---

# Using Superpowers

## Overview

Before responding to any user request, check if any Superpowers skill might apply.

**Core rule:** Even a 1% chance a skill might apply means you should invoke the skill to check.

## Priority Hierarchy

1. User explicit instructions (e.g., CLAUDE.md)
2. Superpowers skills
3. Default system prompt

## Skill Check Precedes Everything

Check skills before:

- Asking clarifying questions
- Exploring the codebase
- Gathering context
- Starting implementation

## Skill Priority Order

1. Process skills (brainstorming, debugging) first
2. Implementation skills second

## Red Flags

- "This is just a simple question"
- "I need more context first"
- "This doesn't need a skill"
- "I already know what to do"
- "The skill doesn't quite fit"
