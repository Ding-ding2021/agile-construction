---
id: DOC-05-DESIGN-STANDARDS
number: GOV-027
domain: governance
category: governance
title: 设计治理规范
owner: designer
status: active
last_updated: 2026-05-13
source_of_truth: false
visual_version: design-standards.html
ai_contract: docs/ai/contracts/design-standards.md
related_code:
  - src-next/themes.css
related_docs:
  - ../02-design/design-spec-v2-shadcn.md
  - ../02-design/design-checklist.md
  - ../02-design/vi-standards.md
  - component-development-contract.md
  - ../02-design/component-catalog.md
---

# 设计治理规范

## Clause 1. Token 治理

### 1.1 [强制] 色彩

- 所有色值使用 `oklch()`，禁止 HEX / RGB / HSL
- 语义色变量优先于直接色阶
- 新增色板必须同时注册亮色/暗色变量

### 1.2 [强制] 间距

- 所有间距为 2px 整数倍，禁止 0.5 步长
- 使用 Tailwind spacing scale

### 1.3 [强制] 字体

- 层级限制 L1-L5，字重仅 400/500/600
- 中英文混排使用 Inter + Noto Sans SC

### 1.4 [强制] 圆角

- 基准 `--radius: 0.625rem`，禁止新增层级

## Clause 2. 主题色板治理

### 2.1 [强制] 已注册色板

- neutral（默认）、blue、green、orange、purple、stone

### 2.2 [强制] 新增色板

- 步骤：选色 → 编码 → 注册 themes.css → 视觉回归
- `--primary` 与背景对比度 ≥ 4.5:1
- 暗色通过 WCAG AA

## Clause 3. 组件治理

### 3.1 [强制] 复用优先级

P0 直接使用 ui/ → P1 CLI 安装 → P2 组合 → P3 自定义

### 3.2 [强制] shadcn 管理

- 全部通过 CLI 安装，禁止手动复制
- 禁止直接修改 shadcn 生成代码

### 3.3 [强制] 禁止行为

- 禁止引入第三方 UI 库
- 禁止内联 `style` prop
- 禁止纯黑纯白

## Clause 4. 审查门禁

| 门禁       | 检查项                               |
| ---------- | ------------------------------------ |
| 视觉一致性 | 语义色、字体层级、间距 2px、无纯黑白 |
| 响应式     | 1920/1360/1024/768 四断点            |
| 暗色模式   | 语义变量、文字可读、无 hardcode      |
| 可访问性   | 对比度 4.5:1、focus ring、关联 label |

## Clause 5. AI 行为约束

- 不得在未确认 shadcn 存在性的情况下新建组件
- 不得使用内联样式
- 不得引入未定义的 CSS 变量
- 必须使用 `cn()` 合并类名
