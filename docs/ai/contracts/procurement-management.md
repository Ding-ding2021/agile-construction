---
id: AI-PROCUREMENT-MANAGEMENT
human_source: docs/01-product/procurement-management-prd.md
status: active
last_synced: 2026-05-11
---

# AI 合约：采购管理

## 模块定位

承接建店过程中材料、设备、服务采购协同，统一管理采购申请、审批、下单、到货、异常处理和结果沉淀，连接任务执行、物料协同、验收交付、资产沉淀、结算依据。

## 核心实体

| 实体                 | 字段                                                                                                                                              | 状态机                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| PurchaseRequest      | request_code, project_id, task_id, request_type(材料/设备/服务), request_source_type, requester_id, brand_id, store_id, budget_estimate, priority | 待申请→待审批→待下单→待到货→已到货          |
| PurchaseRequestItem  | purchase_request_id, item_name, item_category, item_spec, quantity, estimated_unit_price, required_flag, asset_candidate_flag                     | —                                           |
| PurchaseOrder        | order_code, purchase_request_id, project_id, supplier_id, order_amount, planned_delivery_at, receiver_id, approval_result                         | 待下单→待到货→部分到货/已到货/异常中→已关闭 |
| DeliveryRecord       | purchase_order_id, delivery_batch_no, delivered_at, received_by, delivery_status, received_quantity, difference_quantity, attachment_ids          | —                                           |
| ReplenishmentRequest | purchase_order_id, source_delivery_record_id, replenishment_type(补货/替代/重发), affected_task_ids, required_arrival_at                          | —                                           |
| PurchaseException    | project_id, task_id, purchase_order_id, exception_type, exception_level, impact_scope, owner_id, exception_status                                 | —                                           |
| Supplier             | supplier_name, supplier_type, contact_person, qualification_status, cooperation_status                                                            | —                                           |

## 业务规则

1. 未审批通过的采购申请不得生成正式采购单
2. 关键采购单未到货时需提示受影响任务
3. 部分到货必须明细化到具体采购项
4. 异常中采购对象不得静默标记为已完成
5. 关键设备收货前需校验必要资料是否齐全
6. 已关闭采购对象默认只读
7. 从异常中回到待到货必须记录处理结论
8. 关键采购单关闭需提示受影响任务和项目范围
9. Agent 不可跳过审批节点，所有 Agent 动作保留摘要和日志
10. 申请单可继承项目或任务的标准上下文

## 依赖模块

| 模块     | 引用位置                             | 依赖内容                             |
| -------- | ------------------------------------ | ------------------------------------ |
| 项目管理 | purchase_request.project_id          | 汇总采购摘要、关键物料到位、采购风险 |
| 任务中心 | purchase_request.task_id             | 承接采购前置/补货任务；到货阻塞/解阻 |
| 资产管理 | purchase_order→linked_asset_ids      | 设备类采购映射为资产台账来源         |
| 合同结算 | purchase_order→linked_settlement_ids | 采购金额/差异/补货作为结算依据       |
| 标准管理 | standard_rule_refs                   | 材料规格/品牌限制/验收规则绑定       |
| 人员管理 | requester_id, receiver_id            | 申请人/收货人身份                    |

## API 骨架

| 方法     | 路径                                         | 说明                   |
| -------- | -------------------------------------------- | ---------------------- |
| GET/POST | `/api/procurement/requests`                  | 采购申请单列表/新建    |
| GET/PUT  | `/api/procurement/requests/:id`              | 详情/编辑              |
| POST     | `/api/procurement/requests/:id/submit`       | 提交审批               |
| POST     | `/api/procurement/requests/:id/approve`      | 审批通过               |
| POST     | `/api/procurement/requests/:id/reject`       | 审批驳回               |
| GET/POST | `/api/procurement/orders`                    | 采购单列表/新建        |
| GET/PUT  | `/api/procurement/orders/:id`                | 采购单详情/编辑        |
| POST     | `/api/procurement/orders/:id/close`          | 关闭采购单             |
| GET/POST | `/api/procurement/deliveries`                | 到货记录列表/新建      |
| PUT      | `/api/procurement/deliveries/:id/confirm`    | 收货确认               |
| POST     | `/api/procurement/deliveries/:id/difference` | 差异上报               |
| GET/POST | `/api/procurement/exceptions`                | 异常列表/新建          |
| PUT      | `/api/procurement/exceptions/:id/resolve`    | 异常处理               |
| GET/POST | `/api/procurement/replenishments`            | 补货申请列表/新建      |
| GET      | `/api/procurement/orders/:id/tasks`          | 关联任务阻塞状态       |
| GET      | `/api/procurement/stats`                     | 采购效率/质量/风险指标 |

## 质量门禁

- 权限：品牌方可查看本品牌数据；供应商仅可查看本方协同数据
- 审计：所有关键操作留痕（审批、异常、补货、关闭）
- 保留链路：补货与替代必须保留来源采购单和到货记录关系
- 快照固化：采购单创建后、关键设备到货确认前、补货确认时生成标准快照
- 任务解阻：到货确认正确解除任务阻塞；异常中正确阻塞任务
