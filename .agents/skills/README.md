# Skills 说明文档

> 最后更新：2026-05-06

本目录为项目技能（Skills）的统一存放位置，共 **11 个领域、29 个子技能**。
`.claude/skills/` 通过 symlink 指向此处，作为单源存储。

---

## 目录

1. [通用开发流程（Superpowers）](#1-通用开发流程superpowers)
2. [代码库探索与重构（GitNexus）](#2-代码库探索与重构gitnexus)
3. [前端设计与开发](#3-前端设计与开发)
4. [shadcn/ui 组件管理](#4-shadcnui-组件管理)
5. [Next.js 优化](#5-nextjs-优化)
6. [编码行为准则](#6-编码行为准则)

---

## 1. 通用开发流程（Superpowers）

> 14 个子技能，覆盖从需求分析到代码合并的完整开发流程

### 1.1 brainstorming — 需求探索

| 项目 | 内容 |
|------|------|
| **说明** | 在编写代码之前，通过结构化探索将模糊想法转化为具体设计。防止"边写边想"导致的返工。 |
| **触发条件** | **任何新工作开始时必须使用：** 新功能、新项目、重大重构、架构决策、用户需求模糊时。 |
| **关键词** | 设计新功能、架构规划、需求分析 |

### 1.2 writing-plans — 编写实现计划

| 项目 | 内容 |
|------|------|
| **说明** | 根据需求规格创建实现计划，将工作拆分为可独立验证的小任务，每步包含完整代码和验证步骤。 |
| **触发条件** | 有明确的 spec 或需求、需要做多步骤实现时。 |
| **关键词** | 制定计划、任务拆分、实现方案 |

### 1.3 executing-plans — 执行实现计划

| 项目 | 内容 |
|------|------|
| **说明** | 加载已有的书面实现计划，逐任务执行并验证，完成开发。 |
| **触发条件** | 手头已有书面的实现计划需要执行时。 |
| **关键词** | 按计划执行、逐任务实现 |

### 1.4 subagent-driven-development — 子代理并行开发

| 项目 | 内容 |
|------|------|
| **说明** | 使用独立子代理（subagent）并行执行实现计划中的各任务，每个任务经过两阶段评审（规范合规 + 代码质量）。 |
| **触发条件** | 需要并行执行多个独立开发任务时。 |
| **关键词** | 并行开发、多任务执行、子代理 |

### 1.5 dispatching-parallel-agents — 并行代理调度

| 项目 | 内容 |
|------|------|
| **说明** | 当面对多个独立问题时，派发专注的代理分别处理不同问题域。 |
| **触发条件** | 3+ 个不同根因的失败、每个问题可独立理解、无共享状态依赖时。 |
| **关键词** | 并行调试、多问题排查 |

### 1.6 systematic-debugging — 系统化调试

| 项目 | 内容 |
|------|------|
| **说明** | 四阶段调试协议：先定位根因，再提出修复方案。铁律："未找到根因前，不写修复代码。" |
| **触发条件** | 遇到任何 bug、错误、测试失败或非预期行为时。 |
| **关键词** | 排查 bug、调试错误、定位问题根因 |

### 1.7 test-driven-development — 测试驱动开发

| 项目 | 内容 |
|------|------|
| **说明** | 先写测试，再写实现代码。遵循红-绿-重构循环。 |
| **触发条件** | 新功能、bug 修复、重构、行为变更时必须使用。例外（需确认）：一次性原型、生成代码、配置文件。 |
| **关键词** | TDD、先写测试、测试驱动 |

### 1.8 requesting-code-review — 请求代码评审

| 项目 | 内容 |
|------|------|
| **说明** | 在完成任务、实现主要功能或合并前，发起代码评审以验证工作符合要求。 |
| **触发条件** | **必须：** 子代理开发中每个任务完成后、主要功能完成后、合并前。<br>**可选：** 卡住时、重构前、修复复杂 bug 后。 |
| **关键词** | 代码评审、PR review、质量检查 |

### 1.9 receiving-code-review — 接收代码评审

| 项目 | 内容 |
|------|------|
| **说明** | 接收评审反馈后的处理协议——以技术严谨性回应，而非盲目接受。 |
| **触发条件** | 收到代码评审反馈时。 |
| **关键词** | 评审反馈、修改建议处理 |

### 1.10 verification-before-completion — 完成前验证

| 项目 | 内容 |
|------|------|
| **说明** | 声称工作完成前必须运行验证命令并确认结果。铁律："无新鲜验证证据，不得声称完成。" |
| **触发条件** | 即将声称"已完成"、"已修复"、"测试通过"时，在 commit 或 PR 前。 |
| **关键词** | 验证、确认完成、最终检查 |

### 1.11 finishing-a-development-branch — 开发分支收尾

| 项目 | 内容 |
|------|------|
| **说明** | 实现完成、测试通过后，提供结构化选项：合并、PR 或清理。 |
| **触发条件** | 开发工作完成，需要决定如何集成代码时。 |
| **关键词** | 分支合并、PR 创建、代码集成 |

### 1.12 using-git-worktrees — Git Worktree 隔离

| 项目 | 内容 |
|------|------|
| **说明** | 使用 git worktree 为特性开发创建隔离的工作区，避免干扰当前工作。 |
| **触发条件** | 开始需要与当前工作区隔离的特性开发时，或在执行实现计划之前。 |
| **关键词** | 隔离开发、git worktree、独立工作区 |

### 1.13 writing-skills — 编写技能

| 项目 | 内容 |
|------|------|
| **说明** | 创建或修改技能时的 TDD 方法。铁律："没有失败测试，不输出技能。" |
| **触发条件** | 创建或修改 Superpowers skill 时。 |
| **关键词** | 创建技能、修改技能、skill 开发 |

### 1.14 using-superpowers — 技能调度入口

| 项目 | 内容 |
|------|------|
| **说明** | 全局入口，在任何用户请求前检查是否有适用技能。核心规则："即使只有 1% 可能适用，也必须加载检查。" |
| **触发条件** | 每次会话开始时自动触发。 |
| **关键词** | 技能发现、自动调度 |

---

## 2. 代码库探索与重构（GitNexus）

> 6 个子技能，基于知识图谱的代码库分析工具

### 2.1 gitnexus-exploring — 代码探索

| 项目 | 内容 |
|------|------|
| **说明** | 理解代码架构、执行流程，探索不熟悉的代码区域。通过知识图谱查询获取调用链和关联关系。 |
| **触发条件** | "How does X work?"、"What calls this function?"、"Show me the auth flow" |
| **关键词** | 代码理解、架构分析、调用链追踪 |

### 2.2 gitnexus-debugging — 调试追踪

| 项目 | 内容 |
|------|------|
| **说明** | 调试 bug、追踪错误来源、排查失败原因。使用知识图谱快速定位问题所在。 |
| **触发条件** | "Why is X failing?"、"Where does this error come from?"、"Trace this bug" |
| **关键词** | bug 排查、错误追踪、故障定位 |

### 2.3 gitnexus-impact-analysis — 影响分析

| 项目 | 内容 |
|------|------|
| **说明** | 修改前评估爆破半径——哪些代码会受影响、哪些流程会被打断。 |
| **触发条件** | "Is it safe to change X?"、"What depends on this?"、"What will break?" |
| **关键词** | 影响范围、爆破半径、依赖分析 |

### 2.4 gitnexus-refactoring — 安全重构

| 项目 | 内容 |
|------|------|
| **说明** | 安全地重命名、提取、拆分、移动代码结构。通过知识图谱 + 文本搜索确保完整性。 |
| **触发条件** | "Rename this function"、"Extract this into a module"、"Refactor this class"、"Move this to a separate file" |
| **关键词** | 重构、重命名、代码搬迁 |

### 2.5 gitnexus-cli — CLI 操作

| 项目 | 内容 |
|------|------|
| **说明** | 运行 GitNexus CLI 命令：索引仓库、检查状态、清理索引、生成 Wiki。 |
| **触发条件** | "Index this repo"、"Reanalyze the codebase"、"Generate a wiki" |
| **关键词** | GitHub 索引、仓库分析、Wiki 生成 |

### 2.6 gitnexus-guide — 工具指南

| 项目 | 内容 |
|------|------|
| **说明** | 查询 GitNexus 自身的功能、工具、知识图谱模式和工作流参考。 |
| **触发条件** | "What GitNexus tools are available?"、"How do I use GitNexus?" |
| **关键词** | GitNexus 用法、工具查询、图谱模式 |

---

## 3. 前端设计与开发

### 3.1 frontend-design — 高质量前端设计

| 项目 | 内容 |
|------|------|
| **说明** | 创建独特、生产级的前端界面。生成有创意的、精致的代码，避免通用 AI 美学风格。 |
| **触发条件** | 用户要求构建 web 组件、页面或应用程序时。 |
| **关键词** | 设计前端页面、构建 UI 组件、网页设计 |

### 3.2 frontend-ui-animator — 前端动画

| 项目 | 内容 |
|------|------|
| **说明** | 为 Next.js + Tailwind + React 项目分析并实现有目的的 UI 动画。 |
| **触发条件** | "add animations"、"animate UI"、"motion design"、"hover effects"、"scroll animations"、"page transitions"、"micro-interactions" |
| **关键词** | 添加动画、动效设计、悬停效果、页面过渡、微交互 |

### 3.3 frontend-ui-integration — 前端工作流集成

| 项目 | 内容 |
|------|------|
| **说明** | 实现或扩展基于已有后端 API 的前端用户工作流。适用于纯 UI/UX 变更，不涉及后端改动。 |
| **触发条件** | 功能主要是 UI/UX 变更、后端契约已存在、改动仅影响前端时。 |
| **关键词** | 对接后端 API、前端工作流、UI 功能实现 |

### 3.4 clone-website — 网站复刻

| 项目 | 内容 |
|------|------|
| **说明** | 使用 Firecrawl MCP 将网站复刻为生产级 Next.js 16 代码。 |
| **触发条件** | "clone this website"、"vibe clone [url]"、"replicate this landing page"、"rebuild this site in Next.js"、"clone the hero section from [url]"、"copy this design" |
| **关键词** | 克隆网站、复刻页面、复制设计 |

---

## 4. shadcn/ui 组件管理

### 4.1 shadcn-ui — shadcn/ui 组件库

| 项目 | 内容 |
|------|------|
| **说明** | 提供完整的 shadcn/ui 组件库模式：安装、配置、React Hook Form + Zod 表单、Tailwind 主题定制。 |
| **触发条件** | "Set up shadcn/ui"、"Install button/input/form/dialog"、"React Hook Form"、"Zod validation"、"accessible components"、"dark mode"、"CSS variables"、"charts with Recharts" |
| **关键词** | shadcn 组件、表单验证、主题定制、Radix UI |

### 4.2 shadcn-management — shadcn 组件管理

| 项目 | 内容 |
|------|------|
| **说明** | 使用 MCP 工具管理 shadcn/ui 组件：安装、研究实现、获取命令、构建复杂功能。 |
| **触发条件** | "add shadcn"、"shadcn component"、"build UI with shadcn"、"install component"、"create form"、"create dialog" |
| **关键词** | 安装 shadcn、管理组件、组件查询 |

---

## 5. Next.js 优化

### 5.1 rsc-data-optimizer — RSC 数据获取优化

| 项目 | 内容 |
|------|------|
| **说明** | 将客户端数据获取（`useEffect + useState`）优化为 React Server Components 服务端获取，消除 loading spinner 和瀑布式请求。 |
| **触发条件** | "slow loading"、"optimize fetching"、"SSR data"、"RSC optimization"、"remove loading spinner"、"server-side fetch"、"convert to server component"、"data fetch lambat"、"loading lama" |
| **关键词** | 加载慢、SSR 优化、RSC 转换、消除 loading |

---

## 6. 编码行为准则

### 6.1 karpathy-guidelines — Karpathy 编码准则

| 项目 | 内容 |
|------|------|
| **说明** | 减少常见 LLM 编码错误的四项行为准则：**先想后写**（Think Before Coding）、**简单优先**（Simplicity First）、**精准修改**（Surgical Changes）、**目标驱动**（Goal-Driven Execution）。 |
| **触发条件** | 作为行为准则融入每次编码过程，偏向谨慎而非速度。对简单任务可灵活判断。 |
| **关键词** | 编码规范、行为准则、代码质量 |

---

## 附录

### A. 技能触发速查

| 你说什么 | 触发哪个技能 |
|----------|-------------|
| "设计一个新功能" / "这个需求怎么做" | brainstorming → writing-plans |
| "帮我实现这个计划" | executing-plans / subagent-driven-development |
| "这里有个 bug" / "为什么报错" | systematic-debugging / gitnexus-debugging |
| "先写测试" / TDD | test-driven-development |
| "看看代码质量" | requesting-code-review |
| "已完成，检查一下" | verification-before-completion |
| "合并到主分支" | finishing-a-development-branch |
| "这段代码是怎么工作的" | gitnexus-exploring |
| "改这个函数安全吗" | gitnexus-impact-analysis |
| "重命名这个类" | gitnexus-refactoring |
| "分析/索引这个仓库" | gitnexus-cli |
| "克隆这个网站" | clone-website |
| "设计一个页面" | frontend-design |
| "加点动画效果" | frontend-ui-animator |
| "对接后端 API" | frontend-ui-integration |
| "安装 shadcn 组件" | shadcn-management / shadcn-ui |
| "页面加载太慢" | rsc-data-optimizer |
| "新增一个 skill" | writing-skills |
| "用独立分支开发" | using-git-worktrees |

### B. 文件统计

| 分类 | 数量 |
|------|------|
| 顶级领域目录 | 11 |
| 子技能文件 | 29 |
| 其中：通用开发流程 | 14 |
| 其中：代码库探索 | 6 |
| 其中：前端开发 | 4 |
| 其中：shadcn 管理 | 2 |
| 其中：Next.js 优化 | 1 |
| 其中：编码准则 | 1 |
| 其中：调度入口 | 1 |
