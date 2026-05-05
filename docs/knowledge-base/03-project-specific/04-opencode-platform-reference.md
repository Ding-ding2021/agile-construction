---
title: 04 Opencode Platform Reference
status: superseded
last_updated: 2026-05-05
superseded_by: docs/ (see docs/README.md for current docs)
---

# OpenCode 平台参考 — 模式与代理体系

> 本文档记录 OpenCode 平台的工作模式、代理角色和调度参数体系。作为项目开发中与 OpenCode 交互的参考手册。
> 最后更新: 2026-04-28

---

## 一、四个心智模式（Modes）

| 模式          | 中文     | 代理                 | 典型场景                                 | 可并行 |
| ------------- | -------- | -------------------- | ---------------------------------------- | ------ |
| **Direct**    | 直接执行 | 当前主 Agent         | 单文件修改、已知位置编辑、直接回答       | 否     |
| **Explore**   | 探索     | `explore` subagent   | "代码在哪实现？"、代码库 grep            | ✅     |
| **Librarian** | 研究     | `librarian` subagent | 查外部库文档、GitHub 开源、Context7      | ✅     |
| **Oracle**    | 咨询     | `oracle` subagent    | 复杂架构决策、疑难调试、安全审查（只读） | 否     |

### 决策流程

```
用户请求 → 是简单/单文件吗？ → 是 → Direct
                ↓ 否
        需要找代码/查结构？ → 是 → Explore
                ↓ 否
        需要查外部资料？   → 是 → Librarian
                ↓ 否
        需要深度推理/架构？ → 是 → Oracle
```

---

## 二、四个代理身份（Agent Identities）

| 身份           | 角色                         | 核心职责                                         |
| -------------- | ---------------------------- | ------------------------------------------------ |
| **Sisyphus**   | 需求理解 + 任务分解 + 推送   | 拆用户需求为 todo，委派子代理，持续推到底        |
| **Hephaestus** | 高级软件工程师执行体         | 接收任务后执行，可选直接做或调子代理，输出交付物 |
| **Prometheus** | 规划参谋（计划模式）         | 混乱需求先做计划，风险最小化、路径可验证         |
| **Atlas**      | 总指挥 / Master Orchestrator | 统筹上述三者，决定谁干活、顺序、验证             |

> 实际上用户看到的身份取决于初始化时加载的**系统提示模板**，底层是同一个执行体，只是角色提示不同。

---

## 三、调度参数：`task()` 的两种委派方式

### A. `category` — 按领域选型（推荐：开发任务用此）

系统自动匹配该领域表现最佳的模型。

| category             | 用途                                                    |
| -------------------- | ------------------------------------------------------- |
| `visual-engineering` | UI/UX/前端/设计（视觉任务**必须**用此，不得委派到其他） |
| `ultrabrain`         | 复杂算法、架构决策                                      |
| `deep`               | 自主研究 + 端到端实现                                   |
| `quick`              | 单文件 fix、typo 修复                                   |
| `writing`            | 文档、技术写作                                          |
| `artistry`           | 非常规问题、创造性解法                                  |
| `unspecified-low`    | 不好归类但轻量                                          |
| `unspecified-high`   | 不好归类但较重                                          |

### B. `subagent_type` — 按能力选型（专业场景用此）

| 代理        | 用途                           |
| ----------- | ------------------------------ |
| `explore`   | 代码库探索（上下文 grep）      |
| `librarian` | 外部文档/开源代码检索          |
| `oracle`    | 架构咨询、疑难调试、安全审查   |
| `metis`     | 预规划分析：发现隐藏意图、歧义 |
| `momus`     | 计划评审：评估清晰度、可验证性 |

### 使用示例

```typescript
// 前端任务 → visual-engineering
task((category = 'visual-engineering'), (load_skills = ['frontend-ui-ux']), (prompt = '...'))

// 代码搜索 → explore（后台）
task((subagent_type = 'explore'), (run_in_background = true), (load_skills = []), (prompt = '...'))

// 架构咨询 → oracle
task((subagent_type = 'oracle'), (load_skills = []), (prompt = '分析这个方案的并发风险...'))
```

---

## 四、语言规则

| 场景                                      | 语言要求                                         |
| ----------------------------------------- | ------------------------------------------------ |
| 委派 prompt（发给子代理的 `task()` 指令） | **必须用英文**（硬性规则）                       |
| 子代理输出内容                            | 可在英文 prompt 末尾加"请用中文输出"要求中文回复 |
| 主 Agent 对话                             | 支持中文                                         |

---

## 五、重要约束

1. **`category` 和 `subagent_type` 互斥** — 只能传一个
2. **子代理 prompt 必须 ≥ 30 行** — 包含完整 6 个 section
3. **视觉任务必须用 `visual-engineering`** — 不可委派到其他 category
4. **Explore 始终后台运行** — `run_in_background=true`
5. **任务执行不用后台** — 始终 `run_in_background=false`
6. **子代理 stateless** — 每次委派都是新会话，通过 `task_id` 延续上下文

### Prompt 的 6 个 Section

```
1. TASK            — 精确引用任务描述
2. EXPECTED OUTCOME — 文件路径、行为、验证命令
3. REQUIRED TOOLS   — 工具和搜索模式
4. MUST DO          — 必须遵循的约束
5. MUST NOT DO      — 禁止操作
6. CONTEXT          — Notepad + 继承知识 + 依赖
```

---

## 六、验证协议（4-Phase Critical QA）

每次子代理返回后，主 Agent 必须执行：

| Phase | 名称     | 内容                                              |
| ----- | -------- | ------------------------------------------------- |
| 1     | 读代码   | `git diff --stat` + `Read` 每个变更文件，逐行审查 |
| 2     | 自动检查 | `lsp_diagnostics` + 测试 + 构建                   |
| 3     | 实操验证 | 对用户可见的变更，亲自运行/打开验证               |
| 4     | 门禁判断 | 3 个问题全部 YES 方可放行                         |

---

## 七、快速对照

| 你要做什么   | 用哪个                          | 代码                                       |
| ------------ | ------------------------------- | ------------------------------------------ |
| 改一个文件   | Direct                          | `edit({...})`                              |
| 找代码在哪   | `subagent_type="explore"`       | `task(subagent_type="explore", ...)`       |
| 查 API 用法  | `subagent_type="librarian"`     | `task(subagent_type="librarian", ...)`     |
| 架构疑难     | `subagent_type="oracle"`        | `task(subagent_type="oracle", ...)`        |
| 前端开发     | `category="visual-engineering"` | `task(category="visual-engineering", ...)` |
| 复杂逻辑     | `category="ultrabrain"`         | `task(category="ultrabrain", ...)`         |
| 任务前先规划 | Prometheus                      | `todowrite()` + plan 文件                  |
| 全局调度     | Atlas                           | 混用上述所有                               |
