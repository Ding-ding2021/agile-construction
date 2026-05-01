# 知识库与项目上下文

# 知识库与项目上下文模块

## 目的

知识库与项目上下文模块作为敏捷构建平台技术栈、代码模式与开发规范的权威参考。它为开发者提供单一事实来源，用于理解代码库结构、应遵循的模式以及如何与编排开发任务的OpenCode平台进行交互。

## 模块结构

```
docs/knowledge-base/03-project-specific/
├── 01-current-tech-stack.md          # 技术栈与项目结构
├── 02-code-patterns.md               # 可复用代码模式与约定
├── 03-development-standards.md       # 开发标准（引用）
└── 04-opencode-platform-reference.md # OpenCode代理与模式参考
```

## 关键组件

### 1. 技术栈参考（`01-current-tech-stack.md`）

记录当前前端架构：

| 层级   | 技术            | 用途             |
| ------ | --------------- | ---------------- |
| 框架   | React 18.x      | UI框架           |
| 语言   | TypeScript 5.x  | 类型安全         |
| 构建   | Vite 5.x        | 开发服务器与打包 |
| 样式   | TailwindCSS 3.x | 实用优先CSS      |
| UI组件 | shadcn/ui       | 基础组件库       |
| 图表   | Recharts 2.x    | 数据可视化       |
| 路由   | Hash Router     | 客户端路由       |

**项目结构**采用领域组织布局：

```
src/
├── components/     # 按领域划分的UI组件
├── domain/         # 业务逻辑（状态机）
├── data/           # 数据层与模拟数据
├── hooks/          # 自定义React Hooks
├── types/          # TypeScript类型定义
├── lib/            # 工具函数
└── main.tsx        # 应用入口
```

**状态管理**当前使用React Hooks + Context配合localStorage持久化。该模块明确指出这是临时解决方案，并建议迁移至React Query处理服务端状态，使用Zustand处理全局状态。

### 2. 代码模式（`02-code-patterns.md`）

定义了开发者必须遵循的六种既定模式：

#### 状态机模式

`src/domain/projectStatusMachine.ts`中的`ProjectStatusMachine`管理带有守卫条件的项目生命周期转换：

```typescript
// 状态：DRAFT → PENDING_CONFIRM → PENDING_BREAKDOWN → IN_PROGRESS → PENDING_ACCEPTANCE → PENDING_SETTLEMENT → ARCHIVED
// 守卫阻止无效转换（例如，没有里程碑不能进入IN_PROGRESS状态）
```

#### 数据增强模式

通过`src/data/projects.ts`中的`enhanceProject()`将原始模拟数据转换为增强的业务模型。这添加了计算字段，如`dispatchStatus`、`executionStatus`以及视觉属性（`statusTone`、`statusLabel`）。

#### 选择器管道模式

任务过滤遵循`taskManagement.selectors.ts`中的确定性管道：

```
filter → search → advancedFilter → sort → paginate
```

#### 属性传递模式

页面级状态提升到`App.tsx`并通过属性向下传递。这集中了状态，但在深层组件树中可能导致属性钻取。

#### 领域事件日志记录

状态转换生成带有操作者、时间戳和原因字段的结构化日志。

#### 模拟数据工厂

工厂函数（`createMockProject`、`createMockTask`）生成具有合理默认值和覆盖支持的测试数据。

### 3. OpenCode平台参考（`04-opencode-platform-reference.md`）

记录开发平台的代理架构和任务调度系统：

**四种心智模式：**

| 模式       | 代理              | 用例        | 并行 |
| ---------- | ----------------- | ----------- | ---- |
| 直接       | 主代理            | 单文件编辑  | 否   |
| 探索       | `explore`子代理   | 代码库搜索  | 是   |
| 图书管理员 | `librarian`子代理 | 外部API研究 | 是   |
| 先知       | `oracle`子代理    | 架构决策    | 否   |

**四种代理身份：**

| 身份       | 角色               |
| ---------- | ------------------ |
| 西西弗斯   | 需求分解与任务推送 |
| 赫菲斯托斯 | 高级工程师执行     |
| 普罗米修斯 | 规划与风险最小化   |
| 阿特拉斯   | 主编排             |

**任务调度参数：**

- `category` — 基于领域的模型选择（推荐用于开发任务）
  - `visual-engineering` 用于UI/前端（视觉任务必选）
  - `ultrabrain` 用于复杂算法
  - `deep` 用于端到端研究+实现
  - `quick` 用于单文件修复
  - `writing` 用于文档

- `subagent_type` — 基于能力的选择（专业场景）
  - `explore`、`librarian`、`oracle`、`metis`（预规划分析）、`momus`（计划审查）

**关键约束：**

- `category`和`subagent_type`互斥
- 子代理提示必须≥30行，包含6个必需部分
- 视觉任务必须使用`visual-engineering`类别
- 探索始终在后台运行；任务执行从不后台运行
- 子代理无状态——上下文通过`task_id`传递

**验证协议（4阶段关键质量检查）：**

1. 阅读代码（`git diff --stat` + 逐行审查）
2. 自动检查（LSP诊断 + 测试 + 构建）
3. 手动验证（运行/打开变更）
4. 门控检查（批准前3个是/否问题）

## 集成点

知识库模块通过以下方式连接到更广泛的代码库：

1. **`AGENTS.md`** — 引用技术栈和代码模式用于代理任务执行。`架构快速参考`表将领域概念映射到源文件。

2. **`CLAUDE.md`** — 补充代码模式的行为指南。`外科手术式变更`和`简洁优先`规则与该模块强调的最小化、聚焦修改保持一致。

3. **`CODEBUDDY.md`** — 提供知识库静态记录的运行时架构概览。两者共同构成完整图景：静态模式（知识库）+ 动态执行（CODEBUDDY）。

4. **`opencode.json`** — 引用OpenCode平台配置，包括平台参考文档解释的代理模式和构建提示。

5. **`docs/README.md`** — 文档索引，编录所有知识库文件及其与其他文档的关系。

## 使用指南

- **新开发者**应从`01-current-tech-stack.md`开始了解项目结构，然后在编写任何代码之前学习`02-code-patterns.md`
- **实现状态转换时**，始终使用`canTransition()`守卫——切勿直接修改`project.status`
- **添加新功能时**，遵循既定模式：工作流使用状态机，数据处理使用选择器管道，测试数据使用工厂函数
- **使用OpenCode时**，参考`04-opencode-platform-reference.md`以正确选择代理模式和任务调度参数
- **修改任何符号之前**，按照`AGENTS.md`中的规定进行影响分析，以了解影响范围
