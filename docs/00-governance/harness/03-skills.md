---
id: DOC-00-GOVERNANCE-HARNESS-SKILLS
number: GOV-013
domain: governance
category: harness
title: Harness 技能映射
owner: docs-maintainer
status: active
last_updated: 2026-05-13
source_of_truth: true
related_code:
  - .agents/skills/
  - .trae/agents/product-manager.yaml
  - .trae/agents/designer.yaml
  - .trae/agents/developer.yaml
  - .trae/agents/tester.yaml
related_docs:
  - docs/00-governance/harness/00-overview.md
  - docs/00-governance/harness/02-roles.md
  - docs/artifacts/workflow-skill-mapping.md
  - .agents/skills/README.md
---

# Harness 技能映射

## Clause 1. 技能体系总则

**1.1 [强制]** 所有技能统一存放在 `.agents/skills/`，扁平结构（无子目录嵌套）。

**1.2 [强制]** 每收到新用户意图，必须首先查阅本文档第 3 章（触发场景 → Skill）和第 4 章（角色 → Skill）映射表。

**1.3 [强制]** 15-call 自检：强制检查核心技能是否加载。

**1.4 [强制]** 跳过 Skill 直接行动 = 违规，需在 memory/ 中记录。

---

## Clause 2. 技能分类与存储

**2.1 [参考]** 技能分类体系：

| 类型     | 说明                     | 示例                                                                          |
| -------- | ------------------------ | ----------------------------------------------------------------------------- |
| 核心强制 | 无论什么任务，必须调用   | `karpathy-guidelines`、`document-sync`、`verification-before-completion`      |
| 角色专属 | 特定角色在特定场景下使用 | 产品经理：`brainstorming`、`find-skills-x`；开发：`deprecation-and-migration` |
| 场景触发 | 特定场景自动触发         | `code-review-and-quality`、`debugging-and-error-recovery`                     |

**2.2 [强制]** 技能目录结构：

```
.agents/skills/
  <skill-name>/
    SKILL.md       # 技能定义
    scripts/       # 可选辅助脚本
```

详见 [document-governance.md §6.1](../document-governance.md#61-%E5%A4%AE%E5%A4%AE%E4%BB%93%E5%BA%93)。

---

## Clause 3. 触发场景映射

**3.1 [强制]** 以下场景必须调用对应的列出的技能（至少调用一个匹配的）：

### 3.1 需求阶段

| 条款  | 场景                | 应调用 Skill                               |
| ----- | ------------------- | ------------------------------------------ |
| 3.1.1 | 需求模糊，需要澄清  | `brainstorming`、`spec-driven-development` |
| 3.1.2 | 需要评估不同方案    | `doubt-driven-development`                 |
| 3.1.3 | 设计 API 或接口契约 | `api-and-interface-design`                 |
| 3.1.4 | 分析用户行为路径    | `customer-journey`                         |
| 3.1.5 | 用户旅程、触点映射  | `customer-journey`                         |
| 3.1.6 | 需要发现可用的技能  | `find-skills-x`、`using-agent-skills`      |

### 3.2 规划阶段

| 条款  | 场景             | 应调用 Skill                       |
| ----- | ---------------- | ---------------------------------- |
| 3.2.1 | 将需求拆解为任务 | `planning-and-task-breakdown`      |
| 3.2.2 | 制定实施计划     | `writing-plans`、`executing-plans` |
| 3.2.3 | 需要 TDD 工作流  | `test-driven-development`          |
| 3.2.4 | 需要增量交付     | `incremental-implementation`       |

### 3.3 编码阶段

| 条款   | 场景              | 应调用 Skill                                                               |
| ------ | ----------------- | -------------------------------------------------------------------------- |
| 3.3.1  | 修改代码前        | `karpathy-guidelines`                                                      |
| 3.3.2  | 任何代码修改前    | `karpathy-guidelines`（硬性强制）                                          |
| 3.3.3  | 构建 Web UI       | `web-dev`、`frontend-design`、`frontend-ui-engineering`                    |
| 3.3.4  | 基于 Figma 开发   | `frontend-developer`                                                       |
| 3.3.5  | 添加动画效果      | `frontend-ui-animator`                                                     |
| 3.3.6  | 安装 shadcn 组件  | `shadcn-management`、`shadcn-ui`                                           |
| 3.3.7  | 克隆现有网站      | `clone-website`                                                            |
| 3.3.8  | 重构代码          | `code-simplification`、`deprecation-and-migration`、`gitnexus-refactoring` |
| 3.3.9  | 编写测试          | `test-driven-development`                                                  |
| 3.3.10 | 写 Excel 处理代码 | `xlsx`                                                                     |
| 3.3.11 | 写 PDF 处理代码   | `pdf`                                                                      |

### 3.4 调试阶段

| 条款  | 场景            | 应调用 Skill                                                                 |
| ----- | --------------- | ---------------------------------------------------------------------------- |
| 3.4.1 | 遇到 Bug 或错误 | `debugging-and-error-recovery`、`systematic-debugging`、`gitnexus-debugging` |
| 3.4.2 | 性能问题        | `performance-optimization`                                                   |
| 3.4.3 | 浏览器端调试    | `browser-testing-with-devtools`                                              |

### 3.5 审查阶段

| 条款  | 场景         | 应调用 Skill                                                                     |
| ----- | ------------ | -------------------------------------------------------------------------------- |
| 3.5.1 | 代码审查     | `code-review-and-quality`、`code-reviewer（代码审查）`、`requesting-code-review` |
| 3.5.2 | 收到审查反馈 | `receiving-code-review`                                                          |
| 3.5.3 | 安全审查     | `security-and-hardening`                                                         |

### 3.6 文档阶段

| 条款  | 场景         | 应调用 Skill                |
| ----- | ------------ | --------------------------- |
| 3.6.1 | 文档变更后   | `document-sync`（硬性强制） |
| 3.6.2 | 记录架构决策 | `documentation-and-adrs`    |
| 3.6.3 | 编辑画板     | `lark-whiteboard`           |

### 3.7 交付阶段

| 条款  | 场景           | 应调用 Skill                                 |
| ----- | -------------- | -------------------------------------------- |
| 3.7.1 | 声称工作完成前 | `verification-before-completion`（硬性强制） |
| 3.7.2 | 准备生产发布   | `shipping-and-launch`                        |
| 3.7.3 | 最终验收       | `squad-post-dev-review`                      |
| 3.7.4 | 提交代码       | `git-workflow-and-versioning`                |

### 3.8 其他场景

| 条款  | 场景              | 应调用 Skill                                                                                                                                   |
| ----- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 3.8.1 | 优化 Agent 上下文 | `context-engineering`                                                                                                                          |
| 3.8.2 | 设置或修改 CI/CD  | `ci-cd-and-automation`                                                                                                                         |
| 3.8.3 | 需要 UI 设计      | `frontend-ui-integration`                                                                                                                      |
| 3.8.4 | 需要主题设计      | `ui-layout-rules`                                                                                                                              |
| 3.8.5 | 飞书相关操作      | `lark-base`、`lark-calendar`、`lark-doc`、`lark-drive`、`lark-im`、`lark-sheets`、`lark-task`、`lark-vc`、`lark-wiki`、`lark-openapi-explorer` |
| 3.8.6 | 创建或修改技能    | `skill-creator`、`writing-skills`                                                                                                              |

---

## Clause 4. 角色技能分配

**4.1 [强制]** 每个角色必须加载对应技能库。以下为角色技能清单：

### 4.1 产品经理（林墨）

| 条款   | 技能                             | 用途               |
| ------ | -------------------------------- | ------------------ |
| 4.1.1  | `brainstorming`                  | 需求澄清、方案探索 |
| 4.1.2  | `spec-driven-development`        | 规格说明编写       |
| 4.1.3  | `customer-journey`               | 用户旅程分析       |
| 4.1.4  | `doubt-driven-development`       | 对抗性审查         |
| 4.1.5  | `planning-and-task-breakdown`    | 任务拆解           |
| 4.1.6  | `writing-plans`                  | 制定计划           |
| 4.1.7  | `executing-plans`                | 执行计划           |
| 4.1.8  | `document-sync`                  | 文档同步           |
| 4.1.9  | `documentation-and-adrs`         | 决策记录           |
| 4.1.10 | `verification-before-completion` | 完成前验证         |
| 4.1.11 | `code-review-and-quality`        | 代码审查           |
| 4.1.12 | `api-and-interface-design`       | 接口设计           |
| 4.1.13 | `find-skills-x`                  | 技能发现           |
| 4.1.14 | `skill-creator`                  | 技能创建           |
| 4.1.15 | `using-agent-skills`             | 技能调用           |
| 4.1.16 | `shipping-and-launch`            | 发布管理           |
| 4.1.17 | `idea-refine`                    | 想法精炼           |

### 4.2 UI 设计师（苏染）

| 条款  | 技能                      | 用途            |
| ----- | ------------------------- | --------------- |
| 4.2.1 | `frontend-design`         | 前端设计        |
| 4.2.2 | `frontend-ui-engineering` | UI 工程         |
| 4.2.3 | `shadcn-management`       | shadcn 组件管理 |
| 4.2.4 | `shadcn-ui`               | shadcn UI       |
| 4.2.5 | `frontend-ui-animator`    | 动画设计        |
| 4.2.6 | `ui-layout-rules`         | 布局规则        |
| 4.2.7 | `clone-website`           | 网站克隆        |
| 4.2.8 | `web-artifacts-builder`   | Web 构建        |

### 4.3 开发工程师（陈锋）

| 条款   | 技能                            | 用途         |
| ------ | ------------------------------- | ------------ |
| 4.3.1  | `karpathy-guidelines`           | 编码前思考   |
| 4.3.2  | `test-driven-development`       | 测试驱动开发 |
| 4.3.3  | `incremental-implementation`    | 增量实现     |
| 4.3.4  | `code-simplification`           | 代码简化     |
| 4.3.5  | `deprecation-and-migration`     | 废弃迁移     |
| 4.3.6  | `debugging-and-error-recovery`  | 调试         |
| 4.3.7  | `systematic-debugging`          | 系统调试     |
| 4.3.8  | `performance-optimization`      | 性能优化     |
| 4.3.9  | `security-and-hardening`        | 安全加固     |
| 4.3.10 | `rsc-data-optimizer`            | 数据获取优化 |
| 4.3.11 | `browser-testing-with-devtools` | 浏览器调试   |
| 4.3.12 | `git-workflow-and-versioning`   | Git 工作流   |

### 4.4 测试工程师（周严）

| 条款  | 技能                            | 用途         |
| ----- | ------------------------------- | ------------ |
| 4.4.1 | `test-driven-development`       | 测试驱动开发 |
| 4.4.2 | `debugging-and-error-recovery`  | 调试         |
| 4.4.3 | `systematic-debugging`          | 系统调试     |
| 4.4.4 | `browser-testing-with-devtools` | 浏览器测试   |

---

## Clause 5. 执行规则

**5.1 [强制]** 场景映射优先级：先查 Clause 3（触发场景 → Skill），再查 Clause 4（角色 → Skill）。

**5.2 [强制]** 硬性强制技能不可跳过：

| 条款  | 技能                             | 触发场景                  |
| ----- | -------------------------------- | ------------------------- |
| 5.2.1 | `karpathy-guidelines`            | 任何代码修改前            |
| 5.2.2 | `document-sync`                  | 任何 `docs/` 下文档变更后 |
| 5.2.3 | `verification-before-completion` | 声称完成前                |

**5.3 [推荐]** 如果找不到匹配场景，使用 `find-skills-x` 或 `using-agent-skills` 进行技能发现。

**5.4 [强制]** 技能加载失败时，不得绕行，必须记录到 `memory/`。

---

## Clause 6. 技能维护

**6.1 [强制]** 产品经理（林墨）负责维护 Harness 框架及技能体系，包括：

| 条款  | 职责                                              |
| ----- | ------------------------------------------------- |
| 6.1.1 | 新增技能时更新本文档 Clause 3 和 Clause 4         |
| 6.1.2 | 删除废弃技能时从本文档去除                        |
| 6.1.3 | 定期检查 `.agents/skills/` 目录与实际技能的一致性 |
| 6.1.4 | 测试调用路径，确保映射关系有效                    |

**6.2 [推荐]** 每月对技能体系做一次健康检查：

| 条款  | 检查项                       |
| ----- | ---------------------------- |
| 6.2.1 | 是否有新增场景未映射到技能   |
| 6.2.2 | 是否有废弃技能仍被引用       |
| 6.2.3 | 是否有技能 SKILL.md 需要更新 |
