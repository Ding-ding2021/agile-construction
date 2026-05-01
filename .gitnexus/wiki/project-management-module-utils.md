# 项目管理模块 — `utils`

## 概述

`utils` 模块提供了一系列纯函数、无状态的辅助函数，用于处理项目相关的业务逻辑。这些函数没有副作用，不依赖 React 生命周期，可以在任何上下文中安全调用（组件、状态机、测试等）。

## 核心函数

### `parseProgressPair(value: string): { done: number; total: number }`

将 `"完成数/总数"` 格式的进度字符串解析为结构化对象。

- **输入**：类似 `"3/5"` 或 `""` 的字符串
- **输出**：`{ done: number, total: number }`
- **边界情况**：对于空字符串或无效数值，返回 `{ done: 0, total: 0 }`

**示例：**

```typescript
parseProgressPair('3/5') // → { done: 3, total: 5 }
parseProgressPair('') // → { done: 0, total: 0 }
parseProgressPair('abc') // → { done: 0, total: 0 }
```

### `parseBudgetToWan(value: string): number`

从格式化的人民币金额字符串中提取数值预算。

- **输入**：类似 `"¥ 56.5万"` 或 `"¥ 168万"` 的字符串
- **输出**：表示以万元为单位的数值
- **边界情况**：对于非数值输入，返回 `0`

**示例：**

```typescript
parseBudgetToWan('¥ 56.5万') // → 56.5
parseBudgetToWan('¥ 168万') // → 168
parseBudgetToWan('') // → 0
```

### `getProgressCeilingByStatus(status: ProjectStatus): number`

返回给定项目状态允许的最大进度百分比。这强制执行业务规则，防止状态与进度不匹配（例如，状态为"待立项"的项目进度不能超过 20%）。

**状态与上限映射关系：**

| 状态            | 上限 |
| --------------- | ---- |
| 待立项          | 20   |
| 待确认          | 35   |
| 待拆解          | 55   |
| 执行中 / 整改中 | 89   |
| 待验收          | 95   |
| 待结算          | 99   |
| 已归档 / 已中止 | 100  |
| (默认)          | 100  |

### `buildGuardContextFromProject(project: ProjectItem): GuardContext`

从 `ProjectItem` 构建 `GuardContext` 对象，用于 `projectStatusMachine.canTransition` 方法。此函数将原始项目数据转换为状态机守卫条件所需的布尔标志。

**守卫上下文字段及其推导方式：**

| 字段                    | 推导方式                                                   |
| ----------------------- | ---------------------------------------------------------- |
| `hasContainer`          | 始终为 `true`                                              |
| `hasApproval`           | `project.progress >= 10` 或 `project.stage !== '启动'`     |
| `hasMilestones`         | 解析后的里程碑总数 > 0                                     |
| `hasTaskTree`           | 解析后的任务总数 > 0                                       |
| `hasStandardBinding`    | `project.templateId` 为真值 或 `project.progress > 0`      |
| `keyTasksCompleted`     | 如果存在任务：`done/total >= 0.85`；否则：`progress >= 90` |
| `acceptancePassed`      | `progress >= 95` 且 `riskLevel !== 'critical'`             |
| `hasAcceptanceFeedback` | `riskLevel` 不为 null 或 `progress >= 85`                  |
| `rectificationClosed`   | `progress >= 90`                                           |
| `settlementCompleted`   | `progress >= 98` 或状态为 `'已归档'`                       |

## 使用场景

这些工具函数被以下模块使用：

- **`src/App.tsx`** — 主应用组件使用这些辅助函数进行数据转换和验证
- **`src/domain/projectStatusMachine.ts`** — 状态机使用 `buildGuardContextFromProject` 评估转换守卫
- **任何组件** — 需要解析进度字符串、格式化预算或强制执行基于状态的进度限制

## 设计决策

1. **仅包含纯函数** — 无状态、无副作用、无 React 依赖。这使得模块可测试，并可在不同上下文中复用（组件、状态机、服务端代码）。

2. **防御性解析** — `parseProgressPair` 和 `parseBudgetToWan` 都能优雅处理格式错误的输入，返回合理的默认值（`0` 或 `{ done: 0, total: 0 }`）。

3. **显式上限映射** — `getProgressCeilingByStatus` 函数使用穷举的 `switch` 语句而非查找表，使业务规则明确且易于审计。

4. **守卫上下文作为桥梁** — `buildGuardContextFromProject` 充当原始 `ProjectItem` 数据模型与状态机所需的 `GuardContext` 类型之间的适配器，使状态机逻辑与数据层解耦。
