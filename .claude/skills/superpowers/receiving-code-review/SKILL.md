---
name: receiving-code-review
description: Use when receiving code review feedback - establishes protocol for responding to feedback with technical rigor rather than performative agreement
---

# Receiving Code Review

## Overview

Code review requires technical evaluation, not emotional performance.

## Response Pattern

Always follow this order: **Read, Understand, Verify, Evaluate, Respond, Implement**

### 1. Read

Read the full review before responding to any part.

### 2. Understand

Make sure you understand each point. If unclear, ask clarifying questions.

### 3. Verify

Check if the reviewer's technical claim is correct for YOUR codebase.

### 4. Evaluate

Decide: Is this feedback correct and actionable?

### 5. Respond

**When feedback is correct:** Acknowledge factually. "Fixed. [Brief description]" — no gratitude expressions.

**When feedback is unclear:** Ask clarifying questions. Partial understanding = wrong implementation.

**When feedback is wrong:** Push back with technical reasoning. Show code/tests that prove it works.

**Forbidden language:** "You're absolutely right!", "Great point!", etc. — these are performative.

### 6. Implement

Make the changes based on your evaluation.

## External Reviewers

Be skeptical of external reviewers:

- Verify technical correctness for your specific codebase
- Check for breakage
- Consider whether the reviewer has full context

## Key Principle

External feedback = suggestions to evaluate, not orders to follow.
