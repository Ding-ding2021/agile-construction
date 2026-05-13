---
name: systematic-debugging
description: Use when encountering bugs, errors, or unexpected behavior - establishes a four-phase debugging protocol before proposing any fix
---

# Systematic Debugging

## Overview

Four mandatory phases before proposing any fix.

**Iron Law:** NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST.

## The Four Phases

### Phase 1: Root Cause Investigation

- Read errors carefully
- Reproduce consistently
- Check recent changes
- Gather evidence with diagnostic instrumentation
- Trace data flow backward

### Phase 2: Pattern Analysis

- Find working examples
- Compare against references
- Identify differences
- Understand dependencies before attempting fix

### Phase 3: Hypothesis and Testing

- Form a single, written hypothesis
- Test with smallest possible change
- Verify before continuing
- If you don't know, say so

### Phase 4: Implementation

- Create failing test case first
- Implement single fix
- Verify
- If three or more fixes failed: STOP and question the architecture

## Red Flags

- Changing things without understanding root cause
- "Let's try..." without hypothesis
- Making multiple changes at once
- Skipping reproduction steps
- Fixing symptoms instead of root cause
