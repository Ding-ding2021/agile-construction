# 运营与阶段管理

# 运营与阶段管理模块

## 概述

运营与阶段管理模块为多智能体门店建设管理平台提供战略规划、技术债务管理和执行跟踪。它充当产品愿景与实施之间的桥梁，包含商业化策略、组件系统提案、优化方案以及基于阶段的开发评估。

## 模块结构

```
docs/04-operations/
├── commercialization-roadmap-2026-04-25.md    # 变现策略（V1→V2.5）
├── component-system-proposal-mui.md           # 基于MUI的UI组件架构
├── four-page-optimization-plan.md             # 布局/组件统一方案
├── gantt-component-analysis.md                # 甘特图实现分析
├── gradient-token-migration-plan.md           # CSS渐变令牌化策略
├── market-trend-analysis-2026-04-25.md        # 行业/竞争分析
├── phase1/
│   ├── development-progress-assessment-2026-04-25.md  # 阶段1完成度审计
│   └── p1-p1.5-fix-plan-2026-04-25.md                 # 阶段1差距修复方案
├── phase3/
│   ├── cloudbase-e2e-checklist.md                     # CloudBase端到端检查清单
│   ├── collaboration-matrix.md                        # 协作矩阵
│   ├── document-governance-audit-2026-04-16.md        # 文档治理审计
│   ├── local-backend-feasibility.md                   # 本地后端可行性
│   └── weekly-governance-metrics.md                   # 每周治理指标
├── phase4/
│   ├── development-progress-assessment-2026-04-23.md  # 开发进度评估
│   ├── page-issues-audit-2026-04-25.md                # 页面问题审计
│   ├── phase15-assessment-2026-04-25.md               # 阶段1.5评估
│   ├── phase3-retrospective-and-phase4-proposal-2026-04-16.md  # 阶段3回顾与阶段4提案
│   ├── roadmap-v1.2-impact-assessment.md             # 路线图 v1.2 影响评估
│   ├── task-center-prd-evaluation-report.md          # 任务中心PRD评估报告
│   ├── task-management-assessment-2026-04-23.md      # 任务管理评估
│   ├── task-missing-fields-report-2026-04-23.md      # 任务缺失字段报告
│   └── task-simplification-proposal-2026-04-23.md    # 任务简化方案
```

## 关键组件

### 1. 商业化路线图（`commercialization-roadmap-2026-04-25.md`）

定义了四个阶段的变现策略：

| 阶段             | 时间线     | 收入模式              | 关键指标             |
| ---------------- | ---------- | --------------------- | -------------------- |
| V1（价值验证）   | 1-6个月    | 免费（内部系统）      | 闭环完成度           |
| V1.5（价值变现） | 6-12个月   | 品牌订阅（3-15万/年） | 付费品牌数（3-5个）  |
| V2（平台变现）   | 12-24个月  | 交易佣金（2%）        | GMV（目标6000万/年） |
| V2.5（数据变现） | 24个月以上 | 数据产品/报告         | 净利润为正           |

**定价逻辑**：锚定客户成本节约（节约成本的20-50%）。V2保守收入预估：217万/年；乐观预估：684万/年。

### 2. 组件系统提案（`component-system-proposal-mui.md`）

提出了UI组件的三层架构：

```
┌─────────────────────────────────────────┐
│  业务层：PmButton / PmInput / PmTable        │
│  (src/components/shared/mui/)            │
├─────────────────────────────────────────┤
│  MUI层：Button / TextField / DataGrid        │
│  (@mui/material)                        │
├─────────────────────────────────────────┤
│  主题层：pmTheme（暗色玻璃态）                    │
│  (src/theme.ts)                         │
└─────────────────────────────────────────┘
```

**当前状态**：MUI已安装但未使用（仅1处`InputLabel`使用）。代码库中有304+个按钮实例和52+个输入实例，均使用自定义CSS。提案建议进行为期3天的分阶段迁移。

### 3. 四页面优化方案（`four-page-optimization-plan.md`）

针对四个页面（人员管理、数字员工、采购管理、任务管理）进行布局/组件统一，以ProjectManagementPage为基准。

**发现的关键差距**：

- DigitalEmployeePage：自定义statCards（未使用共享的`StatsCards`）
- PersonnelPage/ProcurementManagementPage：自定义标签导航（未使用共享的`TabNav`）
- TaskManagementPage：自定义工具栏（未使用共享的`ListToolbar`）

**执行**：4天内分5个阶段，优先修复项目详情页布局。

### 4. 甘特图分析（`gantt-component-analysis.md`）

评估现有的1177行自实现甘特图与外部库（dhtmlx-gantt、gantt-task-react、frappe-gantt、syncfusion）的对比。

**结论**：保留自实现方案，增加4个缺失功能（依赖线、今日标记、悬停提示、时间粒度切换）。外部库需要大量CSS覆盖才能匹配暗色玻璃态设计。

### 5. 渐变令牌迁移（`gradient-token-migration-plan.md`）

处理代码库中73+个硬编码的`linear-gradient`实例，归类为6种模式：

| 模式            | 出现次数 | 示例                                                                           |
| --------------- | -------- | ------------------------------------------------------------------------------ |
| 统计卡片背景    | ~20      | `linear-gradient(135deg, rgba(43,127,255,0.2) 0%, rgba(43,127,255,0.05) 100%)` |
| 品牌装饰        | ~6       | 头像渐变                                                                       |
| 按钮渐变        | ~4       | 主色/强调色按钮                                                                |
| 进度条          | ~8       | 4种颜色 × 2个方向                                                              |
| KPI背景         | ~8       | 半透明叠加层                                                                   |
| 模态框/表面背景 | ~3       | 暗色叠加层                                                                     |

**迁移**：4阶段方法（共2天），添加CSS自定义属性和语义化工具类。

### 6. 市场趋势分析（`market-trend-analysis-2026-04-25.md`）

全面的行业分析，涵盖：

- **市场规模**：4.11万亿建筑装饰行业，800万家餐厅门店，22%连锁率
- **AI智能体趋势**：全球AI智能体市场 > 2000亿美元（2025年），建筑AI复合年增长率24.8%
- **竞争格局**：市场分散，无主导玩家；现有竞争对手（拓店易、建文软件）缺乏AI智能体能力
- **机会窗口**：12-18个月建立品类领导地位

### 7. 阶段1评估与修复方案（`phase1/`）

#### phase3/ 文档

| 文件                                      | 说明                     |
| ----------------------------------------- | ------------------------ |
| `cloudbase-e2e-checklist.md`              | CloudBase 端到端检查清单 |
| `collaboration-matrix.md`                 | 协作矩阵                 |
| `document-governance-audit-2026-04-16.md` | 文档治理审计             |
| `local-backend-feasibility.md`            | 本地后端可行性分析       |
| `weekly-governance-metrics.md`            | 每周治理指标             |

#### phase4/ 文档

| 文件                                                     | 说明                 |
| -------------------------------------------------------- | -------------------- |
| `development-progress-assessment-2026-04-23.md`          | 开发进度评估         |
| `page-issues-audit-2026-04-25.md`                        | 页面问题审计         |
| `phase15-assessment-2026-04-25.md`                       | 阶段1.5评估          |
| `phase3-retrospective-and-phase4-proposal-2026-04-16.md` | 阶段3回顾与阶段4提案 |
| `roadmap-v1.2-impact-assessment.md`                      | 路线图 v1.2 影响评估 |
| `task-center-prd-evaluation-report.md`                   | 任务中心PRD评估报告  |
| `task-management-assessment-2026-04-23.md`               | 任务管理评估         |
| `task-missing-fields-report-2026-04-23.md`               | 任务缺失字段报告     |
| `task-simplification-proposal-2026-04-23.md`             | 任务简化方案         |

### 8. 阶段1评估与修复方案（`phase1/`）

**开发进度评估**评估阶段1（基础设施）和阶段1.5（视觉统一）的完成度：

| 阶段    | 完成度 | 阻塞问题                                |
| ------- | ------ | --------------------------------------- |
| 阶段1   | ~65%   | 后端仍处于快照模式，CSS硬编码，lint错误 |
| 阶段1.5 | ~40%   | CSS令牌治理，渐变迁移，MUI未启动        |

**修复方案**将补救措施组织为4个波次：

- **波次0**：数据层策略决策（实体表 vs 快照）
- **波次1**：热修复（lint、旧侧边栏删除、CSS清理）— 1-2小时
- **波次2**：核心债务清理（CSS硬编码、导航配置、localStorage清理）— 1-2天
- **波次3**：深度治理（令牌压缩、渐变迁移、组件提取）— 2-3天

## 集成点

运营模块通过以下方式连接到更广泛的代码库：

1. **`src/config/routes.ts`**：集中式路由（462行，18个懒加载页面）
2. **`src/components/shared/`**：共享UI组件（32个文件/目录）
3. **`src/theme.ts`**：设计令牌系统（148+个CSS自定义属性）
4. **`src/services/repositories/`**：数据访问层（9个仓库）
5. **`prisma/schema.prisma`**：数据库模式（431行）

## 当前状态与建议

**关键前进路径**：

1. 在开始阶段2功能开发前，完成波次0-2的修复
2. 优先清理`project-detail.css`中的CSS硬编码（96个实例）
3. 确定数据层策略（实体表 vs 快照）— 当前倾向于实体表
4. 通过试点页面（推荐CustomerManagementPage）开始采用MUI组件

**风险因素**：

- 如果新页面绕过设计令牌，CSS技术债务将继续累积
- 数据层方向的不确定性阻塞所有下游数据依赖任务
- Lint错误（164个）掩盖了真实的代码质量问题
