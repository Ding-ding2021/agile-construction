---
description: 完成任务后总结、写日志并检查是否有遗漏的决策记录
agent: build
subtask: true
---

当前任务的上下文如上面所示。请执行以下步骤：

1. **总结本次任务**：
   - 做了什么
   - 修改了哪些文件
   - 验证结果（lint / build / test）

2. **调用 `task-memory` 工具**写入：
   - `task`：任务简述
   - `detail`：修改内容（文件列表 + 验证结果）
   - `category`：fix / refactor / feat / docs
   - `decision`：如有架构决策
   - `techDebt`：如有技术债务变化

3. **确认无遗漏**后回复"任务完成 ✅"
