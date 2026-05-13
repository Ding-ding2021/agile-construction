---
id: AI-DESIGN-STANDARDS
human_source: docs/00-governance/design-standards.html
status: active
last_synced: 2026-05-13
visual_version: docs/00-governance/design-standards.html
---

# AI 合约：设计治理规范

## 模块定位

定义设计 Token 生命周期、组件准入门禁、主题色板治理规则和 AI 行为约束。

## 核心实体

| 实体       | 字段                                            | 状态机                          |
| ---------- | ----------------------------------------------- | ------------------------------- |
| 设计 Token | 类型（色彩/间距/字体/圆角）, oklch 值, 语义别名 | 按变更流程修改                  |
| 主题色板   | 名称, 20+ 变量（L1/L2/L3）, 亮色/暗色对         | draft → registered → deprecated |
| 审查门禁   | 4 道门（视觉/响应式/暗色/a11y）                 | pass → fail → fix → pass        |

## 业务规则

1. 色彩 Token 必须使用 oklch，禁止 HEX/RGB/HSL
2. 间距必须为 2px 整数倍
3. 字体层级仅 L1-L5，字重仅 400/500/600
4. 新增色板必须同时注册亮色/暗色变量
5. 主题色板必须覆盖 L1/L2/L3 三层变量：
   - **L1 品牌色层**（色相随主题显著变化）：`--primary`, `--primary-foreground`, `--accent`, `--accent-foreground`, `--ring`, `--chart-1`~`--chart-5`, `--sidebar-*` 品牌相关
   - **L2 表面色层**（带微弱色相提示）：`--background`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--border`, `--input`, `--sidebar-border`
   - **L3 中性色层**（所有主题一致）：`--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--foreground`, `--destructive`, `--destructive-foreground`, `--sidebar-foreground`
6. chart-1 到 chart-5 必须在色相上差异显著（至少间隔 50°），确保 5 组可辨识
7. 组件复用优先级 P0（直接使用）→ P1（CLI 安装）→ P2（组合）→ P3（自定义）
8. shadcn 组件禁止手动复制，全部通过 CLI 安装
9. 禁止引入 shadcn 外的第三方 UI 库
10. 禁止内联 style prop（性能动画除外）
11. 禁止纯黑纯白

## 依赖模块

| 模块         | 引用位置                          | 依赖内容        |
| ------------ | --------------------------------- | --------------- |
| VI 规范      | vi-standards.md                   | 色阶/字体具体值 |
| 组件开发合约 | component-development-contract.md | 组件开发流程    |
| 组件查询表   | component-catalog.md              | 组件可用性确认  |
| themes.css   | src-next/themes.css               | 色板 CSS 实现   |

## API 骨架

N/A — 纯治理规范，无 API

## 质量门禁

- 所有变更过 4 道门禁方可合并
- 视觉对比度 ≥ 4.5:1
- 响应式覆盖 1920/1360/1024/768 四断点
- 暗色模式无 hardcode 亮色值
