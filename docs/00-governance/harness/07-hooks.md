---
id: DOC-GOVERNANCE-HARNESS-HOOKS
number: GOV-020
domain: governance
category: harness
title: Hooks 生命周期
owner: docs-maintainer
status: active
last_updated: 2026-05-12
source_of_truth: true
related_code: []
related_docs: []
---

# Hooks 生命周期

## 概述

12 个 Hook 分布在整个开发流程中，负责自动化检查和定时任务触发。

---

## Hook 清单

| #   | Hook          | 位置                                   | 触发时机             | 做什么                     | 阶段 |
| --- | ------------- | -------------------------------------- | -------------------- | -------------------------- | ---- |
| H1  | `pre-commit`  | `.husky/`                              | git commit 前        | lint-staged + tsc --noEmit | 交付 |
| H2  | `commit-msg`  | `.husky/`                              | commit 消息写入时    | Conventional Commits 校验  | 交付 |
| H3  | `pre-commit`  | `.opencode/hooks/`                     | git commit 前        | 同步记忆                   | 交付 |
| H4  | `post-commit` | `.opencode/hooks/`                     | git commit 后        | 采集 stats + 异步写日志    | 交付 |
| H5  | `pre-push`    | `.husky/`（新增）                      | git push 前          | 质量门禁预检               | 交付 |
| H6  | CI lint       | `.github/workflows/ci.yml`             | git push             | ESLint                     | 测试 |
| H7  | CI build      | `.github/workflows/ci.yml`             | git push             | tsc + vite build           | 测试 |
| H8  | CI test       | `.github/workflows/ci.yml`             | git push             | vitest + playwright        | 测试 |
| H9  | 每日总结      | `.github/workflows/daily-summary.yml`  | cron: 0 18 \* \* 1-5 | 聚合日报 + 飞书推送        | 进化 |
| H10 | 周考核        | `.github/workflows/weekly-review.yml`  | cron: 0 17 \* \* 5   | 44 指标聚合 + 周报 + 飞书  | 进化 |
| H11 | 月考核        | `.github/workflows/monthly-review.yml` | cron: 0 9 1 \* \*    | 趋势 + 框架迭代 + 飞书     | 进化 |
| H12 | 发布门禁      | `.github/workflows/ci.yml` (on tags)   | tag push             | 全量 44 指标 + 冻结判断    | 交付 |

---

## Hook 执行链路

```
git commit 触发
    │
    ▼
H1: .husky/pre-commit ──▶ lint-staged + tsc
    │ 失败 → 中断提交
    ▼
H2: .husky/commit-msg ──▶ Conventional Commits 校验
    │ 失败 → 中断提交
    ▼
H3: .opencode/hooks/pre-commit ──▶ 同步记忆
    │
    ▼
commit 完成
    │
    ▼
H4: .opencode/hooks/post-commit ──▶ stats 采集 + 日志写入
    │
    ▼
git push 触发
    │
    ▼
H5: .husky/pre-push ──▶ 质量门禁预检
    │
    ▼
H6-H8: CI jobs (lint / build / test) 并行
    │ 任何失败 → CI 红灯
    ▼
阶段 6 交付完成
    │
    ▼
H9: 每日 18:00 cron ──▶ 日报 + 飞书
H10: 周五 17:00 cron ──▶ 周报 + 飞书
H11: 每月 1 号 cron ──▶ 月报 + 飞书
```

---

## 阶段 × Hook 映射

| 阶段   | Hook            |
| ------ | --------------- |
| 1 定义 | — 无 hook       |
| 2 规划 | — 无 hook       |
| 3 构建 | — 开发手动 lint |
| 4 测试 | H6-H8：CI 自动  |
| 5 评审 | — 无 hook       |
| 6 交付 | H1-H5, H12      |
| 7 进化 | H9-H11 定时触发 |

---

## 新增 Hook：H5 pre-push

```bash
#!/bin/bash
echo "🔍 推送前检查..."

# 1. lint 必须全过
npx eslint . --max-warnings 0 || {
    echo "❌ ESLint 有告警，请先修复"
    exit 1
}

# 2. build 必须通过
npm run build || {
    echo "❌ Build 失败，禁止推送"
    exit 1
}

# 3. 检查当前阶段是否需要 e2e
echo "✅ 推送前检查通过"
```
