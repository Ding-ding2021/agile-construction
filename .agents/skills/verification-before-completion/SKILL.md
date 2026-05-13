---
name: verification-before-completion
description: Use when about to claim work is complete, fixed, or passing, before committing or creating PRs
---

# Verification Before Completion

## Overview

Claiming work is complete without verification is dishonesty, not efficiency.

**Core principle:** Evidence before claims, always.

## The Iron Law

NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE

## The Gate Function

```
BEFORE claiming any status or expressing satisfaction:

1. IDENTIFY: What command proves this claim?
2. RUN: Execute the FULL command (fresh, complete)
3. READ: Full output, check exit code, count failures
4. VERIFY: Does output confirm the claim?
5. ONLY THEN: Make the claim
6. **WRITE MEMORY LOG**: Append to `.workbuddy/memory/YYYY-MM-DD.md` — task title, time, what changed, verification result
```

## Common Failures

| Claim          | Requires                        | Not Sufficient |
| -------------- | ------------------------------- | -------------- |
| Tests pass     | Test command output: 0 failures | Previous run   |
| Linter clean   | Linter output: 0 errors         | Partial check  |
| Build succeeds | Build command: exit 0           | Linter passing |
| Bug fixed      | Test original symptom: passes   | Code changed   |

## Red Flags - STOP

- Using "should", "probably", "seems to"
- Expressing satisfaction before verification
- About to commit/push/PR without verification
- Trusting agent success reports
- ANY wording implying success without having run verification
