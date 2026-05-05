---
name: dispatching-parallel-agents
description: Use when facing multiple independent problems that can be investigated or solved concurrently - dispatches focused agents per problem domain
---

# Dispatching Parallel Agents

## Overview

When facing multiple unrelated problems, dispatch one agent per independent problem domain rather than investigating sequentially.

## When It Applies

**Appropriate when:**

- 3+ failures with different root causes
- Each problem understandable without others' context
- No shared state between investigations

**Not appropriate when:**

- Failures are related
- Full system understanding is needed
- Agents would interfere with each other

## The Pattern

1. **Identify Independent Domains** — group failures by what's broken
2. **Create Focused Agent Tasks** — each agent gets specific scope, clear goal, constraints, and expected output
3. **Dispatch in Parallel** — using parallel task calls
4. **Review and Integrate** — check summaries, verify no conflicts, run full suite

## Effective Agent Prompts

Good prompts are:

- Focused on one file/domain
- Include exact error messages
- List constraints ("Do NOT just increase timeouts")
- Specify expected output format

## Common Mistakes

- Being too broad instead of scoping to one file
- Providing no context rather than pasting error messages
- Omitting constraints so agents wander
- Being vague about output instead of requesting a summary

## Key Benefits

Parallelization, narrow agent focus, independence, and speed.
