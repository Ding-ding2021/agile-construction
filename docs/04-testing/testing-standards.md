---
id: DOC-00-GOVERNANCE-TESTING-STANDARDS
number: TST-001
domain: testing
category: test-standards
title: 测试规范
owner: docs-maintainer
status: active
last_updated: 2026-05-11
source_of_truth: true
ai_contract: docs/ai/contracts/testing-standards.md
related_code:
  - vitest.config.ts
  - src/test/setup.ts
related_docs:
  - docs/00-governance/code-review-checklist.md
  - docs/00-governance/quality-metrics.md
  - docs/00-governance/coding-standards.md
---

# 测试规范

> 版本: v1.0
> 最后更新: 2026-05-11
> 工具链: Vitest + jsdom + @testing-library/react + Playwright

---

## 1. 铁律

| #   | 规则                                                | 强制 |
| --- | --------------------------------------------------- | ---- |
| 1.1 | 任何新功能、Bug 修复、重构必须先写测试（TDD）       | 强制 |
| 1.2 | CI 中测试失败 = 阻断合并                            | 强制 |
| 1.3 | 覆盖率低于阈值 = 阻断合并                           | 强制 |
| 1.4 | 禁止提交没有对应测试的代码（例外见 §5.2）           | 强制 |
| 1.5 | 禁止使用 `@ts-ignore` / `@ts-expect-error` 绕过测试 | 强制 |

---

## 2. 测试金字塔

```
        ╱  E2E  ╲            ← Playwright, 覆盖关键用户流程
      ╱  集成测试  ╲          ← 服务层 + 仓储层 + API 协同
    ╱   单元测试    ╲         ← 领域逻辑 + 选择器 + 纯函数
  ╱    静态分析       ╲      ← TypeScript + ESLint
```

| 层级     | 工具          | 覆盖目标                                 | 数量占比 |
| -------- | ------------- | ---------------------------------------- | -------- |
| 单元测试 | Vitest        | 领域逻辑、选择器、工具函数、自定义 Hook  | ≥ 70%    |
| 组件测试 | Vitest + RTL  | 组件渲染、交互、状态覆盖                 | ≥ 15%    |
| 集成测试 | Vitest + Mock | 仓储层、服务层、状态机协同               | ≥ 10%    |
| E2E 测试 | Playwright    | 关键用户流程（登录、创建项目、状态流转） | ≤ 5%     |

---

## 3. 测试风格

### 3.1 文件命名

```
src/<module>/__tests__/<name>.test.ts       # 纯逻辑
src/<module>/__tests__/<name>.test.tsx      # 组件测试
src/<module>/__tests__/<name>.e2e.test.ts   # E2E 场景标注
```

测试文件放在被测模块的 `__tests__/` 目录下。

### 3.2 用例命名

```
describe('<模块名>', () => {
  it('应<期望行为>', () => { ... })           // ✅ 推荐
  it('当<条件>时，应<期望行为>', () => { ... }) // ✅ 推荐

  it('test1', () => { ... })                   // ❌ 禁止
  it('should work', () => { ... })             // ❌ 禁止
})
```

命名必须描述业务场景，不描述代码实现。

### 3.3 用例结构

每个用例遵循 AAA 模式：

```typescript
it('应拒绝空邮箱', async () => {
  // Arrange —— 准备数据
  const formData = { email: '' }

  // Act —— 执行操作
  const result = await submitForm(formData)

  // Assert —— 验证结果
  expect(result.error).toBe('邮箱不能为空')
})
```

### 3.4 一个用例只测一件事

```typescript
// ❌ 坏：一个用例测多件事
it('应验证邮箱、手机号和密码', () => { ... })

// ✅ 好：拆为三个用例
it('应拒绝空邮箱', () => { ... })
it('应拒绝非法手机号', () => { ... })
it('应拒绝过短密码', () => { ... })
```

it 的 name 中出现"和"、"与"、"、" → 拆分。

### 3.5 测试数据构造

```typescript
// ✅ 推荐：工厂函数
function createProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 'proj-1',
    name: '测试项目',
    status: 'preparation',
    progress: 0,
    ...overrides,
  }
}

// ✅ 推荐：批量构造
const projects = Array.from({ length: 10 }, (_, i) =>
  createProject({ id: `proj-${i}`, name: `项目${i}` })
)
```

禁止在每个用例中手写测试数据。

---

## 4. Mock 策略

### 4.1 选择规则

| 场景                              | 策略             | 工具                                 |
| --------------------------------- | ---------------- | ------------------------------------ |
| 外部 API / 网络请求               | 模块级 Mock      | `vi.mock('@/services/api/client')`   |
| 浏览器 API（localStorage、fetch） | 全局 Mock 或真实 | `vi.stubGlobal('localStorage', ...)` |
| 时间相关（Date、setTimeout）      | 模拟时钟         | `vi.useFakeTimers()`                 |
| 组件 props / 回调                 | 直接传入         | 无需 Mock                            |
| Zustand Store                     | 直接构造初始状态 | `useStore.setState(...)`             |

### 4.2 模块级 Mock

```typescript
// ✅ 推荐：在文件顶部 hoisted Mock
const { mockSaveState } = vi.hoisted(() => ({
  mockSaveState: vi.fn(),
}))

vi.mock('@/services/api/serverAdapter', () => ({
  serverAdapter: {
    saveProjectState: mockSaveState,
  },
}))
```

### 4.3 Mock 隔离

```typescript
beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
})
```

禁止跨用例共享 Mock 状态。

---

## 5. 覆盖率

### 5.1 当前阈值（`vitest.config.ts`）

| 指标       | 当前阈值 | 目标阈值（2026-Q2） |
| ---------- | -------- | ------------------- |
| lines      | 55%      | 70%                 |
| statements | 55%      | 70%                 |
| functions  | 42%      | 60%                 |
| branches   | 42%      | 55%                 |

### 5.2 豁免规则

以下场景可不计入覆盖率要求：

- 纯类型定义文件（`.d.ts`）
- generated / prisma 代码
- 配置类文件（`vite.config.ts`、`vitest.config.ts`）
- 临时调试代码（需标注 `// TODO: 测试覆盖`，且有关联 Issue）

### 5.3 必须覆盖的代码

- 状态机守卫条件 —— 每条分支必须覆盖
- 数据转换/选择器逻辑 —— 输入输出一一验证
- 错误处理路径 —— 正常路径 + 异常路径
- 边界条件 —— 空数据、越界、非法输入

---

## 6. TDD 规范

### 6.1 流程

```
RED    → 写一个会失败的测试
        验证：测试因"功能缺失"而失败（非代码错误）
GREEN  → 写最简代码让它通过
        验证：新测试 + 所有已有测试通过
REFACTOR → 清理代码，保持测试全绿
```

### 6.2 铁律

| #   | 规则                                    | 后果       |
| --- | --------------------------------------- | ---------- |
| 1   | 未先写测试就写代码 → 删除代码重新开始   | 审核不通过 |
| 2   | 测试通过但不能说明为何失败过 → 测试无效 | 审核不通过 |
| 3   | Mock 过多导致测试不可信 → 重构设计      | 打回       |
| 4   | 一个用例测多件事 → 拆分                 | 打回       |

### 6.3 验证方式

```bash
# RED 阶段 —— 确认测试因正确原因失败
npx vitest run src/domain/__tests__/xxx.test.ts
# 输出: FAIL · expected 'xxx' got undefined

# GREEN 阶段 —— 确认全部通过
npx vitest run
# 输出: PASS · Tests: 1 passed
```

### 6.4 常见反模式

| 反模式                 | 问题               | 修正                          |
| ---------------------- | ------------------ | ----------------------------- |
| 测试 Mock 实现而非行为 | 重构时测试假阳性   | 测返回值/副作用，不测调用次数 |
| 测试先通过（TDD 假）   | 测试测的是已有代码 | 删除实现，确认测试先失败      |
| 测试依赖执行顺序       | 并行运行失败       | 用 `beforeEach` 重置状态      |

---

## 7. 组件测试

### 7.1 测什么

```typescript
// ✅ 渲染测试 —— 组件是否正常渲染
it('应渲染项目名称', () => {
  render(<ProjectCard project={createProject()} />)
  expect(screen.getByText('测试项目')).toBeInTheDocument()
})

// ✅ 交互测试 —— 用户操作触发预期行为
it('点击后应触发 onClick 回调', async () => {
  const onClick = vi.fn()
  render(<ProjectCard project={createProject()} onClick={onClick} />)
  await userEvent.click(screen.getByRole('button'))
  expect(onClick).toHaveBeenCalledTimes(1)
})

// ✅ 状态覆盖 —— 各视觉状态
it('加载中应显示骨架屏', () => { ... })
it('数据为空应显示空态', () => { ... })
it('出错应显示错误提示', () => { ... })
```

### 7.2 不测什么

| 不测                             | 理由                | 替代               |
| -------------------------------- | ------------------- | ------------------ |
| 第三方 UI 库（shadcn/MUI）的渲染 | 上游已测            | 只测我们的组合逻辑 |
| 精确的 CSS 样式属性              | 脆弱、维护成本高    | E2E 视觉回归测试   |
| 排版/字号/颜色值                 | 设计 Token 变更频繁 | 用 snapshot 或 E2E |

### 7.3 工具约定

```typescript
// 使用 @testing-library/userEvent，不用 fireEvent
import userEvent from '@testing-library/user-event'

// 优先 getByRole 兜底 getByText
screen.getByRole('button', { name: '提交' })
screen.getByText('项目名称')
```

---

## 8. CI 门禁

### 8.1 质量门禁流水线

```
Pull Request / Push to main
        ↓
  1. lint (0 errors)
  2. type & build (0 errors)
  3. unit & component tests (npm run test:run)
  4. coverage check (阈值：lines ≥ 55%, functions ≥ 42%, branches ≥ 42%)
  5. E2E 测试（含关键路径）
        ↓
  全部通过 → APPROVED
  任意失败 → BLOCKED
```

### 8.2 当前状态

| 步骤         | CI 中是否执行      | 是否阻断合并          |
| ------------ | ------------------ | --------------------- |
| lint         | ✅                 | 仅 warning 不阻断     |
| type & build | ✅                 | ✅                    |
| unit tests   | ✅                 | ✅                    |
| coverage     | ✅（报告）         | ❌（未 enforce 阈值） |
| E2E          | ❌（有配置未集成） | —                     |

### 8.3 计划改进

| 优先级 | 改进项                                              | 目标日期 |
| ------ | --------------------------------------------------- | -------- |
| P0     | 覆盖率阈值从 55% 提升至 70%（lines）                | 2026-Q2  |
| P1     | CI 中 enforce 覆盖率阈值（`--coverage.thresholds`） | 2026-Q2  |
| P1     | CI 集成 E2E 测试                                    | 2026-Q2  |
| P2     | lint 升级为阻断（0 error + 0 warning）              | 2026-Q3  |

---

## 9. 各模块测试策略

### 9.1 领域层（domain/）

| 测试对象   | 测试内容                           | 测试方法    |
| ---------- | ---------------------------------- | ----------- |
| 状态机守卫 | 每条守卫分支（包含需要原因的路径） | 纯函数测试  |
| 状态转换   | 允许/禁止的流转组合                | 遍历 + 断言 |
| 上下文校验 | 不同上下文下守卫条件行为           | 参数化测试  |

### 9.2 服务层（services/）

| 测试对象                    | 测试内容                         | 测试方法           |
| --------------------------- | -------------------------------- | ------------------ |
| 仓储层（Repository）        | 本地持久化、远程降级、幂等键透传 | Mock serverAdapter |
| 错误模型（StructuredError） | 字段完整、分类正确、日志格式     | 纯函数测试         |
| API 客户端                  | 重试机制、超时、错误解析         | Mock fetch         |

### 9.3 组件层（components/）

| 测试对象 | 测试内容                   | 测试方法         |
| -------- | -------------------------- | ---------------- |
| 共享组件 | 渲染、交互、空/加载/错误态 | RTL + userEvent  |
| 选择器   | 统计、筛选、排序、分页组合 | 纯函数测试       |
| 页面组件 | 路由参数绑定、Store 数据流 | RTL + Store Mock |

### 9.4 集成测试（local-api）

| 测试对象     | 测试内容                             | 测试方法     |
| ------------ | ------------------------------------ | ------------ |
| 本地 API     | 路由分发、CORS、幂等键去重           | HTTP 请求    |
| 端到端数据流 | localStorage → API → SQLite 完整链路 | 启动真实服务 |

---

## 10. 验收标准

代码提交前确认：

- [ ] 新增代码有对应的单元测试
- [ ] TDD：能说明每个新测试的 RED 阶段失败原因
- [ ] 覆盖率未击穿当前阈值
- [ ] `npm run test:run` 全部通过
- [ ] `npm run lint` 0 errors
- [ ] `npm run build` 0 errors
- [ ] 组件测试覆盖了 loading / empty / error 三种状态
- [ ] 测试文件符合命名规范，用例名描述业务场景

---

## 11. 相关文档

- [代码规范](./coding-standards.md)
- [Code Review Checklist](./code-review-checklist.md)
- [质量指标体系](./quality-metrics.md)
- [AI 测试指南](../03-engineering/ai-testing-guide.md)
