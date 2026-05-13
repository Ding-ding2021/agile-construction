---
id: AI-VI-STANDARDS
human_source: docs/02-design/vi-standards.md
status: active
last_synced: 2026-05-13
visual_version: docs/02-design/vi-standards.html
---

# AI 合约：基础 VI 规范

## 模块定位

定义字体体系（L1-L5 层级）和色彩体系（neutral 色阶、语义色、主题色板）的标准。

## 核心实体

| 实体     | 字段                                                      | 状态机              |
| -------- | --------------------------------------------------------- | ------------------- |
| 字体层级 | 名称 L1-L5, 字号 24/18/15/13/12, 字重 600/600/600/500/400 | 固定 5 级，不可扩展 |
| 色阶     | 级别 50-950, oklch 值, 语义别名                           | 固定 11 级          |
| 主题色板 | 名称, primary/accent 色值, CSS 类名                       | 按治理流程添加/删除 |

## 业务规则

1. 所有色值使用 oklch()，禁止 HEX/RGB/HSL
2. 语义变量优先于直接色阶
3. 间距为 2px 整数倍
4. 禁止纯黑 #000 和纯白 #FFF
5. 中英文混排必须用 Inter + Noto Sans SC

## 依赖模块

| 模块             | 引用位置                             | 依赖内容                   |
| ---------------- | ------------------------------------ | -------------------------- |
| DES-001 设计规范 | vi-standards.md                      | 设计哲学基座               |
| themes.css       | src-next/themes.css                  | 色值 token 的实际 CSS 实现 |
| 设计治理         | ../00-governance/design-standards.md | Token 变更流程             |

## API 骨架

N/A — 纯规范文档，无 API

## 质量门禁

- 色值使用 oklch 而非其它格式
- L1-L5 不得跳级使用
- 暗色模式变量必须成对注册
