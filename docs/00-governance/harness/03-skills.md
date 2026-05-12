---
id: DOC-GOVERNANCE-HARNESS-
number: GOV-016
domain: governance
category: harness
title: 技能体系
owner: docs-maintainer
status: active
last_updated: 2026-05-12
source_of_truth: true
related_code: []
related_docs: []
registry_ref: .harness/registry.yaml#skills
---

# 技能体系

## 概述

79 个技能按四大专业分配（另含 24 个飞书集成技能）。技能分为本地文件（SKILL.md）和内置 IDE 技能（Skill tool）两类。

---

## 技能分布

| 来源               | 路径 / 来源                  | 本地文件 | 备注                                  |
| ------------------ | ---------------------------- | -------- | ------------------------------------- |
| 项目技能           | `.agents/skills/`            | 34       | 14 顶层 + 6 GitNexus + 14 Superpowers |
| 全局设计技能       | `~/.config/opencode/skills/` | 23       | 24 去重 chinese-language              |
| Claude 技能        | `~/.claude/skills/`          | 1        | 仅 `code-comprehension`               |
| **本地文件总计**   |                              | **58**   |                                       |
| 内置 IDE 技能      | Skill tool                   | +21      | 分配到各专业的非文件技能              |
| **总计（含内置）** |                              | **79**   |                                       |

---

## 林墨 · 产品经理（27 个技能）

### 流程控制（12）

| 技能                             | 触发时机                 | 阶段 |
| -------------------------------- | ------------------------ | ---- |
| `brainstorming`                  | 需求不清晰、需要探索方案 | 定义 |
| `spec-driven-development`        | 需要输出正式规格         | 定义 |
| `idea-refine`                    | 模糊想法需要精炼         | 定义 |
| `using-superpowers`              | 启动会话、技能入口       | 全程 |
| `using-agent-skills`             | 不确定哪个 skill 适用    | 全程 |
| `find-skills-x`                  | AI 驱动技能搜索          | 全程 |
| `skill-creator`                  | 创建/修改/测试技能       | 进化 |
| `writing-skills`                 | 编写技能的技能           | 进化 |
| `planning-and-task-breakdown`    | spec 就绪，要拆任务      | 规划 |
| `writing-plans`                  | 编写实现计划             | 规划 |
| `executing-plans`                | 执行实现计划             | 构建 |
| `verification-before-completion` | 声称完成前自检           | 构建 |

### Squad 管理（5）

| 技能                       | 触发时机     | 阶段 |
| -------------------------- | ------------ | ---- |
| `squad-pre-dev-evaluation` | 发起评审小组 | 定义 |
| `squad-post-dev-review`    | 发起验收小组 | 评审 |
| `code-review-and-quality`  | 代码质量审查 | 评审 |
| `receiving-code-review`    | 接收审查反馈 | 评审 |
| `requesting-code-review`   | 请求代码审查 | 评审 |

### 交付运维（4）

| 技能                             | 触发时机           | 阶段 |
| -------------------------------- | ------------------ | ---- |
| `shipping-and-launch`            | 准备上线           | 交付 |
| `ci-cd-and-automation`           | 配置 CI/CD 流水线  | 交付 |
| `git-workflow-and-versioning`    | 分支管理、提交规范 | 交付 |
| `finishing-a-development-branch` | 开发完成、决定合入 | 交付 |

### 基础支撑（4）

| 技能                  | 触发时机               | 阶段      |
| --------------------- | ---------------------- | --------- |
| `context-engineering` | 优化 Agent 上下文      | 全程      |
| `website-audit`       | 网站系统分析           | 定义      |
| `code-comprehension`  | 非技术化理解代码       | 定义/评审 |
| `document-sync`       | 文档变更后同步 AI 合约 | 全程      |

### 共享技能（3）

| 技能                             | 共享方 | 产品用来做什么 |
| -------------------------------- | ------ | -------------- |
| `documentation-and-adrs`         | 开发   | 管理文档体系   |
| `customer-journey`               | 设计   | 分析用户旅程   |
| `verification-before-completion` | 测试   | 完成确认       |

---

## 苏染 · UI设计师（33 个技能）

### 设计工程（8）

| 技能                      | 触发时机              | 阶段      |
| ------------------------- | --------------------- | --------- |
| `frontend-design`         | 构建 UI 界面          | 构建      |
| `ui-layout-rules`         | 布局/间距/色值检查    | 构建/评审 |
| `frontend-ui-animator`    | 添加动效/过渡         | 构建      |
| `frontend-ui-engineering` | UI 工程               | 构建      |
| `shadcn-ui`               | shadcn 组件使用       | 构建      |
| `shadcn-management`       | 安装/管理 shadcn 组件 | 构建      |
| `clone-website`           | 复制网站设计          | 构建      |
| `web-artifacts-builder`   | 原型/演示             | 定义/构建 |

### 设计基础（11）

| 技能                 | 触发时机                   |
| -------------------- | -------------------------- |
| `ui-design`          | 布局、组件、层次、设计令牌 |
| `ux-design`          | 用户研究、交互、信息架构   |
| `design-process`     | 简报→线框→原型→交接        |
| `design-trends`      | 2026 设计趋势              |
| `visual-direction`   | 调色板、字体配对、视觉语言 |
| `color-theory`       | 60-30-10、语义色彩、WCAG   |
| `web-typography`     | 字体、排版比例、行高       |
| `responsive-design`  | 移动优先、断点、流体       |
| `component-patterns` | 复合组件、变体系统         |
| `ui-patterns`        | 英雄区/导航/卡片/CTA       |
| `navigation-design`  | 菜单、面包屑、搜索         |

### 品牌与质量（6）

| 技能                 | 触发时机           |
| -------------------- | ------------------ |
| `branding-identity`  | 品牌策略、视觉识别 |
| `images-media`       | 图像策略、SVG      |
| `accessibility`      | WCAG 2.1 AA        |
| `usability`          | Nielsen 启发式     |
| `ai-design-workflow` | AI 设计流程        |
| `customer-journey`   | 用户旅程           |

### 专项审查（3）

| 技能               | 触发时机      |
| ------------------ | ------------- |
| `landing-pages`    | 转化优化      |
| `agent-ui-design`  | Agent 聊天 UI |
| `webdesign-review` | 元设计审查    |

### 共享技能（5）

| 技能                            | 共享方 |
| ------------------------------- | ------ |
| `browser-testing-with-devtools` | 测试   |
| `shadcn-ui`                     | 开发   |
| `frontend-ui-engineering`       | 开发   |
| `squad-pre-dev-evaluation`      | 全专业 |
| `squad-post-dev-review`         | 全专业 |

---

## 陈锋 · 开发工程师（35 个技能）

### 编码实现（6）

| 技能                          | 触发时机           | 阶段      |
| ----------------------------- | ------------------ | --------- |
| `karpathy-guidelines`         | 任何编码前（强制） | 规划/构建 |
| `incremental-implementation`  | 多文件实现         | 构建      |
| `test-driven-development`     | 测试先行           | 构建      |
| `subagent-driven-development` | 子代理执行         | 构建      |
| `source-driven-development`   | 权威文档引用       | 构建      |
| `code-simplification`         | 重构简化           | 构建      |

### 前端工程（5）

| 技能                      | 触发时机         |
| ------------------------- | ---------------- |
| `frontend-ui-engineering` | UI 组件/页面     |
| `frontend-ui-integration` | 前端对接后端 API |
| `shadcn-ui`               | shadcn 组件      |
| `shadcn-management`       | shadcn 安装管理  |
| `clone-website`           | 网站克隆         |

### 架构与后端（7）

| 技能                        | 触发时机           |
| --------------------------- | ------------------ |
| `api-and-interface-design`  | API 设计           |
| `doubt-driven-development`  | 高风险决策对抗审查 |
| `security-and-hardening`    | 安全加固           |
| `performance-optimization`  | 性能优化           |
| `deprecation-and-migration` | 废弃迁移           |
| `documentation-and-adrs`    | ADR 架构决策       |
| `rsc-data-optimizer`        | RSC 数据优化       |

### 代码管理与分析（8）

| 技能                       | 触发时机      |
| -------------------------- | ------------- |
| `using-git-worktrees`      | 工作树隔离    |
| `context-engineering`      | 上下文配置    |
| `gitnexus-cli`             | 代码索引      |
| `gitnexus-debugging`       | 知识图谱调试  |
| `gitnexus-exploring`       | 代码探索      |
| `gitnexus-guide`           | GitNexus 参考 |
| `gitnexus-impact-analysis` | 影响分析      |
| `gitnexus-refactoring`     | 安全重构      |

### 共享技能（4）

| 技能                       | 共享方 |
| -------------------------- | ------ |
| `frontend-ui-engineering`  | 设计   |
| `shadcn-ui`                | 设计   |
| `test-driven-development`  | 测试   |
| `squad-pre-dev-evaluation` | 全专业 |

---

## 周严 · 测试工程师（12 个技能）

| 技能                            | 触发时机     | 阶段 |
| ------------------------------- | ------------ | ---- |
| `browser-testing-with-devtools` | 浏览器验证   | 测试 |
| `debugging-and-error-recovery`  | Bug 排查定位 | 测试 |
| `systematic-debugging`          | 系统化调试   | 测试 |
| `dispatching-parallel-agents`   | 并行测试     | 测试 |
| `usability`                     | 可用性评估   | 评审 |

### 共享技能

| 技能                             | 共享方    | 测试用来做什么 |
| -------------------------------- | --------- | -------------- |
| `test-driven-development`        | 开发      | TDD 规范审查   |
| `code-review-and-quality`        | 产品/开发 | 质量审查       |
| `verification-before-completion` | 产品      | 完成验证       |
| `browser-testing-with-devtools`  | 设计      | 浏览器测试     |
| `squad-pre-dev-evaluation`       | 全专业    | 测试评审       |
| `squad-post-dev-review`          | 全专业    | 测试验收       |

---

## 飞书集成技能（24 个，`~/.claude/skills/`）

飞书（Lark）技能尚未分配专业归属，当前作为独立工具集存在，供需要飞书操作时按需加载。

| 技能                            | 用途             | 建议归属  |
| ------------------------------- | ---------------- | --------- |
| `lark-approval`                 | 飞书审批 API     | 产品/测试 |
| `lark-attendance`               | 飞书考勤打卡     | 产品      |
| `lark-base`                     | 飞书多维表格     | 全专业    |
| `lark-calendar`                 | 飞书日历日程     | 全专业    |
| `lark-contact`                  | 飞书通讯录       | 全专业    |
| `lark-doc`                      | 飞书云文档       | 全专业    |
| `lark-drive`                    | 飞书云空间       | 全专业    |
| `lark-event`                    | 飞书事件订阅     | 开发      |
| `lark-im`                       | 飞书即时通讯     | 全专业    |
| `lark-mail`                     | 飞书邮箱         | 全专业    |
| `lark-markdown`                 | 飞书 Markdown    | 全专业    |
| `lark-minutes`                  | 飞书妙记         | 全专业    |
| `lark-okr`                      | 飞书 OKR         | 产品      |
| `lark-openapi-explorer`         | 飞书原生 OpenAPI | 开发      |
| `lark-shared`                   | 飞书 CLI 基础    | 开发      |
| `lark-sheets`                   | 飞书电子表格     | 全专业    |
| `lark-skill-maker`              | 飞书 Skill 制作  | 产品/开发 |
| `lark-slides`                   | 飞书幻灯片       | 设计      |
| `lark-task`                     | 飞书任务         | 产品      |
| `lark-vc`                       | 飞书视频会议     | 全专业    |
| `lark-vc-agent`                 | 飞书会议 Agent   | 开发/测试 |
| `lark-whiteboard`               | 飞书画板         | 设计      |
| `lark-wiki`                     | 飞书知识库       | 全专业    |
| `lark-workflow-meeting-summary` | 飞书会议纪要     | 产品      |
| `lark-workflow-standup-report`  | 飞书日程待办     | 产品      |

---

## 共享技能交叉表

| 技能                             | 产品 | 设计 | 开发 | 测试 |
| -------------------------------- | ---- | ---- | ---- | ---- |
| `frontend-ui-engineering`        |      | ●    | ●    |      |
| `shadcn-ui`                      |      | ●    | ●    |      |
| `shadcn-management`              |      | ●    | ●    |      |
| `clone-website`                  |      | ●    | ●    |      |
| `browser-testing-with-devtools`  |      | ●    |      | ●    |
| `squad-pre-dev-evaluation`       | ●    | ●    | ●    | ●    |
| `squad-post-dev-review`          |      | ●    | ●    | ●    |
| `test-driven-development`        |      |      | ●    | ●    |
| `code-review-and-quality`        | ●    |      |      | ●    |
| `context-engineering`            | ●    |      | ●    |      |
| `documentation-and-adrs`         | ●    |      | ●    |      |
| `document-sync`                  | ●    |      |      |      |
| `verification-before-completion` | ●    |      |      | ●    |
| `customer-journey`               | ●    | ●    |      |      |
| `usability`                      |      | ●    |      | ●    |
