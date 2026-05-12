---
title: 任务中心 ERD
number: DEV-011
domain: development
category: architecture
status: active
last_updated: 2026-05-05
---

# 任务中心实体关系图

## 完整 ER 图

```mermaid
erDiagram
    %% 项目层
    PROJECT ||--o{ WORK_PACKAGE : contains
    PROJECT ||--o{ TASK : owns

    %% 工作包层
    WORK_PACKAGE ||--|| COST_ACCOUNT : mapped_to
    WORK_PACKAGE ||--o{ TASK : groups
    WORK_PACKAGE ||--o{ SERVICE_WORK_PACKAGE_REL : bound_by

    %% 任务层 - 树形结构
    TASK ||--o{ TASK : parent_child
    TASK ||--o{ TASK_RELATION : has_relation

    %% 任务扩展关系
    TASK ||--o{ TASK_STANDARD_BINDING : binds_standard
    TASK ||--o{ TASK_SNAPSHOT : snapshots
    TASK ||--o{ TASK_CHECKLIST : has_checklist
    TASK ||--o{ TASK_SUBMISSION : submits
    TASK ||--o{ TASK_REMINDER : reminds
    TASK ||--o{ TASK_EVENT_LOG : logs
    TASK ||--o{ TASK_ATTACHMENT : has_attachments

    %% 外包/服务层
    CONTRACT ||--o{ SERVICE : defines
    SERVICE ||--o{ SERVICE_WORK_PACKAGE_REL : binds_workpackage

    %% ========== 实体定义 ==========

    PROJECT {
        string project_id PK
        string project_code
        string project_name
        string status
        string brand_id
        string store_id
        datetime created_at
    }

    WORK_PACKAGE {
        string work_package_id PK
        string project_id FK
        string cost_account_id FK
        string work_package_code
        string work_package_name
        string stage_id
        string description
        string manager_id FK
        string status
        int planned_work_hours
        int actual_work_hours
        decimal budget
        int progress_percent
        datetime planned_start_at
        datetime planned_end_at
        datetime actual_start_at
        datetime actual_end_at
        datetime created_at
        datetime updated_at
    }

    COST_ACCOUNT {
        string cost_account_id PK
        string cost_account_code
        string cost_account_name
        string budget_amount
        string actual_amount
    }

    TASK {
        string task_id PK
        string project_id FK
        string work_package_id FK
        string parent_task_id FK
        string task_code
        string task_name
        string task_description
        string node_level_type
        string task_type
        string task_status
        string priority
        boolean required_flag
        boolean milestone_flag
        string owner_role
        string assignee_type
        string assignee_id FK
        datetime planned_start_at
        datetime planned_end_at
        datetime actual_start_at
        datetime actual_end_at
        int planned_work_hours
        int actual_work_hours
        int progress_percent
        string blocked_reason
        json object_ids
        json standard_snapshot
        string contract_id FK
        string service_id FK
        string sla_rule_id
        string derived_source_task_id
        boolean is_rectification
        string rectification_reason
        int reopen_count
        string close_reason
        datetime created_at
        string created_by
        datetime updated_at
        string updated_by
    }

    TASK_RELATION {
        string relation_id PK
        string from_task_id FK
        string to_task_id FK
        string relation_type
        string relation_desc
        int lag_days
        boolean active_flag
        datetime created_at
    }

    TASK_STANDARD_BINDING {
        string binding_id PK
        string task_id FK
        string standard_package_id
        string standard_package_snapshot_id
        string execution_standard_id
        string acceptance_standard_id
        string checklist_template_id
        datetime bound_at
    }

    TASK_SNAPSHOT {
        string snapshot_id PK
        string task_id FK
        string standard_snapshot_id
        string snapshot_version
        json snapshot_data
        datetime generated_at
    }

    TASK_CHECKLIST {
        string checklist_id PK
        string task_id FK
        string checklist_template_id
        string item_name
        string item_type
        boolean required_flag
        string status
        string evidence_type
        int sort_order
        datetime completed_at
    }

    TASK_SUBMISSION {
        string submission_id PK
        string task_id FK
        string submission_type
        string submission_desc
        string submission_status
        json attachment_ids
        string submitted_by
        datetime submitted_at
        string reviewed_by
        string review_result
        string review_comment
        datetime reviewed_at
    }

    TASK_REMINDER {
        string reminder_id PK
        string task_id FK
        string reminder_type
        string reminder_reason
        string receiver_type
        string receiver_id
        string feedback_summary
        datetime reminder_at
        boolean closed_flag
        datetime closed_at
    }

    TASK_EVENT_LOG {
        string log_id PK
        string task_id FK
        string event_type
        string event_desc
        json before_value
        json after_value
        string operator_id
        string operator_source
        datetime operated_at
    }

    TASK_ATTACHMENT {
        string attachment_id PK
        string task_id FK
        string submission_id FK
        string file_name
        string file_type
        string file_size
        string file_url
        string upload_by
        datetime upload_at
    }

    CONTRACT {
        string contract_id PK
        string contract_code
        string contract_name
        string vendor_id
        string contract_type
        string status
        datetime signed_at
        datetime expired_at
    }

    SERVICE {
        string service_id PK
        string contract_id FK
        string service_code
        string service_name
        string service_type
        string status
        decimal service_price
    }

    SERVICE_WORK_PACKAGE_REL {
        string rel_id PK
        string service_id FK
        string work_package_id FK
        string allocation_type
        datetime bound_at
    }

    %% ========== Phase 2 新增实体 ==========

    %% 人员与权限
    PERSONNEL {
        string personnel_id PK
        string name
        string role
        string department
        string status
        string email
        string phone
        boolean is_external
        json skills
        datetime created_at
        datetime updated_at
    }

    PERMISSION {
        string permission_id PK
        string personnel_id FK
        string resource
        string action
        string scope
        datetime created_at
    }

    %% 标准库（对象抽象层）
    STANDARD_FILE {
        string standard_file_id PK
        string standard_code
        string standard_name
        string version
        string category
        string status
        datetime created_at
    }

    STANDARD_CLAUSE {
        string clause_id PK
        string standard_file_id FK
        string clause_number
        string title
        string content
        string type
        datetime created_at
    }

    STANDARD_OBJECT {
        string object_id PK
        string object_name
        string category
        string description
        datetime created_at
    }

    CLAUSE_OBJECT_BINDING {
        string binding_id PK
        string clause_id FK
        string object_id FK
        string role
        datetime created_at
    }

    %% ========== Phase 2 新增关系 ==========

    PERSONNEL ||--o{ TASK : assigned_to
    PERSONNEL ||--o{ WORK_PACKAGE : manages
    PERSONNEL ||--o{ PERMISSION : has_permissions
    TASK ||--o{ STANDARD_OBJECT : binds_via_objects
    STANDARD_OBJECT ||--o{ CLAUSE_OBJECT_BINDING : links_to_clauses
    STANDARD_CLAUSE ||--o{ CLAUSE_OBJECT_BINDING : linked_by_objects
    STANDARD_FILE ||--o{ STANDARD_CLAUSE : contains
```

## 核心关系说明

| 关系                                    | 类型       | 说明                                 |
| --------------------------------------- | ---------- | ------------------------------------ |
| PROJECT 1:N WORK_PACKAGE                | 一对多     | 一个项目包含多个工作包               |
| WORK_PACKAGE 1:1 COST_ACCOUNT           | 一对一     | 每个工作包绑定唯一成本账户           |
| WORK_PACKAGE 1:N TASK                   | 一对多     | 工作包下包含多个任务/子任务          |
| TASK 1:N TASK                           | 自引用     | 父子任务层级关系                     |
| TASK 1:N TASK_RELATION                  | 一对多     | 任务间的依赖/派生关系                |
| CONTRACT 1:N SERVICE                    | 一对多     | 一个合同可定义多个服务               |
| SERVICE N:M WORK_PACKAGE                | 多对多     | 服务与工作包通过关联表绑定           |
| **PERSONNEL 1:N TASK**                  | **一对多** | **人员作为任务执行人（assignee）**   |
| **PERSONNEL 1:N WORK_PACKAGE**          | **一对多** | **人员作为工作包负责人（manager）**  |
| **PERSONNEL 1:N PERMISSION**            | **一对多** | **人员拥有多个权限**                 |
| **STANDARD_FILE 1:N STANDARD_CLAUSE**   | **一对多** | **标准文件包含多个条款**             |
| **STANDARD_CLAUSE N:M STANDARD_OBJECT** | **多对多** | **条款与对象通过绑定表关联**         |
| **TASK N:M STANDARD_OBJECT**            | **多对多** | **任务通过 object_ids 绑定多个对象** |

## 关键业务规则

1. **层级规则（Phase 2 更新：4层→3层）**
   - ~~项目(Project) → 工作包(WorkPackage) → 任务(Task) → 子任务(SubTask)~~
   - **项目(Project) → 工作包(WorkPackage) → 任务(Task)**
   - 子任务(SubTask)通过 `parent_task_id` 自引用在任务层内表达，不独立为层级
   - 阶段(Stage)作为项目生命周期属性（`stage_id`），不纳入任务树层级

2. **成本归集规则**
   - 所有任务成本归集到所属 `work_package_id`
   - 成本核算主键为 `cost_account_id`
   - `work_package_id` 与 `cost_account_id` 1:1 强约束

3. **状态流转规则**
   - 主状态字段：`task_status`
   - 派生/投影字段：`dispatch_status` / `sla_status`

4. **外包关系规则**
   - 外包任务必须绑定 `contract_id` 和 `service_id`
   - 一个服务可打包多个工作包

## 扩展实体说明

### 任务相关

| 实体                  | 用途                                 |
| --------------------- | ------------------------------------ |
| TASK_STANDARD_BINDING | 绑定执行标准、验收标准、检查清单模板 |
| TASK_SNAPSHOT         | 任务标准快照，记录绑定时的标准版本   |
| TASK_CHECKLIST        | 执行清单/检查项，将标准转为具体动作  |
| TASK_SUBMISSION       | 任务提交记录，支持多次提交历史       |
| TASK_REMINDER         | 催办记录，支持系统/人工/自动催办     |
| TASK_EVENT_LOG        | 任务操作审计日志                     |
| TASK_ATTACHMENT       | 任务附件/资料管理                    |

### Phase 2 新增实体

| 实体                      | 用途                                 |
| ------------------------- | ------------------------------------ |
| **PERSONNEL**             | **人员信息，支持任务分配与权限管理** |
| **PERMISSION**            | **权限配置（资源/操作/范围）**       |
| **STANDARD_FILE**         | **标准文件（如 GB/T 50254-2024）**   |
| **STANDARD_CLAUSE**       | **标准条款（如"4.2 线路铺设要求"）** |
| **STANDARD_OBJECT**       | **标准对象（如"线路铺设"）**         |
| **CLAUSE_OBJECT_BINDING** | **条款-对象关联（多对多）**          |

### 对象抽象层说明

**Phase 2 引入的标准绑定新链路**：

```
TASK（任务）
  ↓ object_ids（绑定对象ID列表）
STANDARD_OBJECT（标准对象，如"线路铺设"）
  ↓ CLAUSE_OBJECT_BINDING（通过关联表）
STANDARD_CLAUSE（标准条款，如"4.2 线路铺设要求"）
  ↓ standard_file_id（归属）
STANDARD_FILE（标准文件，如"GB/T 50254-2024"）
```

**优势**：

- 工程人员按对象思考（"我要做线路铺设"），不用记条款号
- 一个对象可关联多个条款（执行标准 + 验收标准）
- 标准文件更新时，重建条款-对象映射即可
