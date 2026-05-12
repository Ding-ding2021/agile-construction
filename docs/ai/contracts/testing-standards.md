---
id: AI-TESTING-STANDARDS
human_source: docs/00-governance/testing-standards.md
status: active
last_synced: 2026-05-11
title: AI 合约：测试规范
last_updated: 2026-05-12
---

# AI 合约：测试规范

## 铁律

1. 新功能/Bug 修复必须先写测试（TDD）
2. CI 中测试失败 = 阻断合并
3. 覆盖率低于阈值 = 阻断合并
4. 禁止提交无对应测试的代码

## 测试金字塔

| 层级     | 工具          | 覆盖目标                 | 占比  |
| -------- | ------------- | ------------------------ | ----- |
| 单元测试 | Vitest        | 领域逻辑、选择器、纯函数 | ≥ 70% |
| 组件测试 | Vitest + RTL  | 组件渲染、交互、状态     | ≥ 15% |
| 集成测试 | Vitest + Mock | 仓储层、服务层协同       | ≥ 10% |
| E2E      | Playwright    | 关键用户流程             | ≤ 5%  |

## 用例规范

- 文件：`<module>/__tests__/<name>.test.ts(x)`
- 命名：`describe('<模块>')` + `it('应<期望行为>')`
- 结构：AAA 模式（Arrange / Act / Assert）
- 一条用例只测一件事（name 中出现"和"即违规）

## Mock 规则

| 场景          | 策略                                        |
| ------------- | ------------------------------------------- |
| 外部 API      | `vi.mock('@/services/api/...')` 模块级 Mock |
| localStorage  | `vi.stubGlobal` 或真实                      |
| 时间          | `vi.useFakeTimers()`                        |
| Zustand Store | `useStore.setState(...)` 直接构造           |

禁止跨用例共享 Mock 状态，`beforeEach` 中 `vi.clearAllMocks()` + `localStorage.clear()`。

## 覆盖率

| 指标      | 当前阈值 | 目标（2026-Q2） |
| --------- | -------- | --------------- |
| lines     | 55%      | 70%             |
| functions | 42%      | 60%             |
| branches  | 42%      | 55%             |

豁免：类型定义、generated、配置文件、标注 TODO+Issue 的临时代码。

## 组件测试规范

- 测：渲染、交互（userEvent）、状态覆盖（loading/empty/error）
- 不测：第三方 UI 库渲染、精确 CSS 样式、色值

## CI 门禁

| 步骤         | 状态                 |
| ------------ | -------------------- |
| lint         | 执行，warning 不阻断 |
| type & build | ✅ 阻断              |
| unit tests   | ✅ 阻断              |
| coverage     | 仅报告，未 enforce   |
| E2E          | ❌ 未集成            |

## 交付验收 checklist

- [ ] 新增代码有对应单元测试
- [ ] TDD：能说明每个新测试的 RED 失败原因
- [ ] `npm run test:run` 全部通过
- [ ] `npm run lint` 0 errors
- [ ] `npm run build` 0 errors
