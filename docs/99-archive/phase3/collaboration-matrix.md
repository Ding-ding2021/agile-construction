---
id: DOC-04-OPERATIONS-PHASE3-COLLABORATION-MATRIX
number: ARC-042
domain: archive
category: archived
title: collaboration-matrix
status: archived
last_updated: 2026-04-16
archived_at: 2026-05-12
archived_reason: 历史归档
owner: docs-maintainer
source_of_truth: true
related_code: []
related_docs: []
---

## 阶段3协作矩阵（你 + AI）

### 协作原则

- **一条主链一次只推进一个关键动作**，避免并行冲突。
- **你负责业务决策与最终确认，AI负责实现、记录与回归执行。**
- 所有结果必须可复盘：有输入、动作、输出、证据。

### 分工边界

- **你**
  - 业务优先级裁决（先做什么）
  - 风险接受与发布决策（是否推进）
  - 阶段性验收确认（DoD签收）
- **AI**
  - 代码与文档实现
  - 回归清单执行与结果整理
  - 问题定位建议与修复草案

### 任务流转（统一模板）

1. **输入**：目标 + 约束 + 期望结果
2. **执行**：AI按依赖顺序落地
3. **证据**：请求/响应/日志/截图/变更文件
4. **验收**：你确认是否满足 DoD
5. **归档**：进入周评审证据包

### 交付物映射

- 启动计划：`launch-checklist.md`
- 真链路回归：`cloudbase-e2e-checklist.md`
- 代码改动：`src/App.tsx`、`src/services/api/client.ts` 等主链文件
- 周评审包：每周一份，固定结构

### 异常处理约定

- 出现阻断（鉴权、接口、数据不一致）时：
  - AI立即记录“阻断现象/影响面/建议动作”
  - 你决定“继续绕行 or 停止修复”
- 未决阻断不得标记为“完成”，必须保留待办和证据

### DoD 判定口径

- 文档可执行：任何人按文档可复现
- 回归可验证：至少包含一次真实通过证据
- 异常可追踪：失败有错误码或日志定位
- 结论可评审：周报可独立阅读
