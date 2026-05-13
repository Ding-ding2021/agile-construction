---
id: DOC-02-DESIGN-COMPONENT-DEV-CONTRACT
number: DES-003
domain: design
category: development
title: 组件开发合约
owner: docs-maintainer
status: active
last_updated: 2026-05-13
source_of_truth: true
related_code: []
ai_contract: docs/ai/contracts/component-development.md
related_docs:
  - ../00-governance/design-standards.md
  - component-catalog.md
  - design-checklist.md
  - coding-standards.md
---

# 组件开发合约

## Clause 1. 合约总览

### 1.1 [参考] 目的

本合约定义 React 组件开发的标准流程和 AI 行为约束，确保组件质量、可维护性和一致性。

### 1.2 [参考] 术语

| 术语        | 定义                                      |
| ----------- | ----------------------------------------- |
| 通用组件    | 可在多个页面/功能中复用的 UI 组件         |
| 领域组件    | 与特定业务逻辑绑定的组件                  |
| Contract    | 组件对外暴露的接口（Props、事件、上下文） |
| shadcn 组件 | 通过 shadcn CLI 安装的社区组件            |

---

## Clause 2. 通用组件开发流程

### 2.1 [强制] 流程步骤

**2.1.1 [强制]** **需求分析**：产品经理（或 AI）明确组件需要展示的数据、交互行为、可访问性要求。

**2.1.2 [强制]** **确定复用**：检查是否已有 shadcn 组件或项目内已有组件可复用。

### 2.2 [强制] 复用优先级

| 优先级 | 策略                 | 说明                                 |
| ------ | -------------------- | ------------------------------------ |
| P0     | 使用 shadcn CLI 安装 | `npx shadcn@latest add button`       |
| P1     | 使用现有项目组件     | 从已有的 shadcn 组件或项目组件中选择 |
| P2     | 在 shadcn 基础上组合 | 多个 shadcn 组件组合为新功能组件     |
| P3     | 新建组件             | 仅在确实需要时才新建                 |

**2.2.1 [强制]** 新建前必须确认没有现成的 shadcn/ui 组件可用。

### 2.3 [强制] Props 接口

**2.3.1 [强制]** 组件必须实现明确的 Props TypeScript 接口。

**2.3.2 [强制]** shadcn 组件使用其原始 Props 约束，扩展时使用 `extends` 或交叉类型。

### 2.4 [强制] 样式

**2.4.1 [强制]** 使用 Tailwind CSS，遵循现有样式 Token。

**2.4.2 [强制]** shadcn 组件使用 `cn()` 辅助函数合并类名。

### 2.5 [推荐] 测试

**2.5.1 [推荐]** 关键交互组件编写测试用例。

### 2.6 [强制] 导出

**2.6.1 [强制]** 命名导出为主，不使用默认导出。

---

## Clause 3. 领域组件开发流程

### 3.1 [强制] 流程步骤

**3.1.1 [强制]** **业务分析**：明确组件关联的领域实体和业务规则。

**3.1.2 [强制]** **Contract 定义**：先定接口（Props / 回调 / 上下文），后写实现。

**3.1.3 [强制]** **实现**：遵循 Contract 实现功能逻辑。

**3.1.4 [强制]** **测试**：领域组件必须有单元测试覆盖业务逻辑。

**3.1.5 [强制]** **集成**：接入数据层，验证端到端流程。

### 3.2 [强制] Contract 优先

**3.2.1 [强制]** 组件对外 Contract 必须在使用前定义清晰。

**3.2.2 [强制]** Contract 内容：Props 类型、回调函数签名、Context 数据类型。

---

## Clause 4. AI 行为约束

### 4.1 [强制] 禁止行为

**4.1.1 [强制]** 禁止在不确认是否有现成 shadcn 组件的情况下创建新组件。

**4.1.2 [强制]** 禁止在已有 shadcn 组件基础上完全重写。

**4.1.3 [强制]** 禁止在组件中直接使用内联样式（`style={{}}`）。

**4.1.4 [强制]** 禁止修改 `cn()` 行为或覆盖 shadcn 的全局样式机制。

**4.1.5 [强制]** 禁止创建与现有组件功能重叠的新组件。

### 4.2 [强制] 必须遵守

**4.2.1 [强制]** 组件文件必须导出 Props 接口。

**4.2.2 [强制]** shadcn 组件必须通过 CLI 安装，禁止手动复制粘贴 shadcn 组件代码。

**4.2.3 [强制]** 组件 Props 必须向前兼容，接口变更需同步更新所有使用点。

**4.2.4 [强制]** AI 创建的组件路径必须与项目现有结构一致。

---

## Clause 5. 模板参考

### 5.1 [参考] 通用组件模板

```tsx
import { type FC } from 'react'
import { cn } from '@/lib/utils'

interface MyComponentProps {
  title: string
  variant?: 'default' | 'outline'
  className?: string
}

export const MyComponent: FC<MyComponentProps> = ({ title, variant = 'default', className }) => {
  return (
    <div className={cn('base-styles', variant === 'outline' && 'outline-styles', className)}>
      {title}
    </div>
  )
}
```
