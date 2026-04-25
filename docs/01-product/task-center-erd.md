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
        string status
        datetime created_at
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
        string required_flag
        string milestone_flag
        string owner_role
        string assignee_type
        string assignee_id
        datetime planned_start_at
        datetime planned_end_at
        datetime actual_start_at
        datetime actual_end_at
        string progress_percent
        string blocked_reason
        string standard_snapshot_id
        string contract_id FK
        string service_id FK
        string sla_rule_id
        string derived_source_task_id
        datetime created_at
        string created_by
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
```

## 核心关系说明

| 关系                          | 类型   | 说明                        |
| ----------------------------- | ------ | --------------------------- |
| PROJECT 1:N WORK_PACKAGE      | 一对多 | 一个项目包含多个工作包      |
| WORK_PACKAGE 1:1 COST_ACCOUNT | 一对一 | 每个工作包绑定唯一成本账户  |
| WORK_PACKAGE 1:N TASK         | 一对多 | 工作包下包含多个任务/子任务 |
| TASK 1:N TASK                 | 自引用 | 父子任务层级关系            |
| TASK 1:N TASK_RELATION        | 一对多 | 任务间的依赖/派生关系       |
| CONTRACT 1:N SERVICE          | 一对多 | 一个合同可定义多个服务      |
| SERVICE N:M WORK_PACKAGE      | 多对多 | 服务与工作包通过关联表绑定  |

## 关键业务规则

1. **层级规则**
   - 项目(Project) → 工作包(WorkPackage) → 任务(Task) → 子任务(SubTask)
   - 任务通过 `parent_task_id` 自引用形成树形结构

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

| 实体                  | 用途                                 |
| --------------------- | ------------------------------------ |
| TASK_STANDARD_BINDING | 绑定执行标准、验收标准、检查清单模板 |
| TASK_SNAPSHOT         | 任务标准快照，记录绑定时的标准版本   |
| TASK_CHECKLIST        | 执行清单/检查项，将标准转为具体动作  |
| TASK_SUBMISSION       | 任务提交记录，支持多次提交历史       |
| TASK_REMINDER         | 催办记录，支持系统/人工/自动催办     |
| TASK_EVENT_LOG        | 任务操作审计日志                     |
| TASK_ATTACHMENT       | 任务附件/资料管理                    |
