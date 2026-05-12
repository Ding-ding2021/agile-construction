---
id: AI-CODE-REVIEW-CHECKLIST
human_source: docs/00-governance/code-review-checklist.md
status: active
last_synced: 2026-05-11
title: AI 合约：Code Review Checklist
last_updated: 2026-05-12
---

# AI 合约：Code Review Checklist

## 四角色审查

| 角色     | 人物 | 审查维度                           | 技能                                          |
| -------- | ---- | ---------------------------------- | --------------------------------------------- |
| 功能验收 | 林墨 | 需求覆盖、边界条件、错误场景       | code-review-and-quality                       |
| UI 验收  | 苏染 | 色值、状态、暗色、响应式、可访问性 | ui-layout-rules, accessibility                |
| 代码验收 | 陈锋 | 规范、架构、死代码、抽象           | code-simplification, gitnexus-impact-analysis |
| 测试验收 | 周严 | 测试覆盖、E2E、边界                | browser-testing-with-devtools, usability      |

## 通用门禁

- npm run build — 0 errors
- npm run lint — 0 errors
- npm run test:run — All passing
- 覆盖率 ≥ lines 55% / functions 42% / branches 42%

## 审查结论规则

| 结论              | 条件              | 后续动作           |
| ----------------- | ----------------- | ------------------ |
| APPROVED          | 全部通过          | 林墨合并，进入交付 |
| CHANGES REQUESTED | 某角色发现问题    | 仅问题角色重审     |
| BLOCKED           | 架构性/原则性问题 | 林墨仲裁 → 人类    |
