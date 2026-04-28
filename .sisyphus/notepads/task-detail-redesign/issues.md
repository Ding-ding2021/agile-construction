# TaskDetailPage 问题汇总

> **审查日期**: 2026-04-28
> **文件**: `src/components/task/TaskDetailPage.tsx` (839 行)
> **状态**: 待决策

---

## 一、架构问题（代码结构）

| 编号 | 问题               | 详情                                                                                      | 严重度 |
| ---- | ------------------ | ----------------------------------------------------------------------------------------- | ------ |
| A1   | **单文件 839 行**  | 混合了编辑表单、状态流转、附件管理、检查项、流转日志 5 个独立功能，违反单一职责           | 🔴     |
| A2   | **无子组件拆分**   | 所有 UI 逻辑都在同一个 `TaskDetailPage` 函数体内，无法独立测试和复用                      | 🔴     |
| A3   | **MUI sx 噪音**    | 839 行中 ~500 行是内联 `sx` 样式，改一个颜色值要在几十处重复修改                          | 🟡     |
| A4   | **设计令牌未统一** | 颜色通过 `t()` 函数和 `var(--pm-xxx)` 拼串访问，但没有统一的 spacing/radius/font 令牌对象 | 🟡     |
| A5   | **缺少错误边界**   | 无 ErrorBoundary 包裹子区域，任何一个区崩溃会导致整个详情页面白屏                         | 🟡     |

### 建议拆分方案

```
src/components/task/detail/
  TaskEditForm.tsx          // 编辑表单（负责人、日期、风险等级）
  TaskStatusPanel.tsx       // 状态流转 + 操作按钮
  TaskAttachmentList.tsx    // 附件列表 + 上传
  TaskChecklistPanel.tsx    // 检查项 + 进度条
  TaskTransitionLog.tsx     // 流转日志（Timeline 组件）
  TaskDetailPage.tsx        // 纯编排层（~150 行）
  index.ts
```

---

## 二、样式问题（视觉效果）

| 编号 | 问题                   | 详情                                                                                                      | 严重度 |
| ---- | ---------------------- | --------------------------------------------------------------------------------------------------------- | ------ |
| B1   | **表单长墙**           | 9 个 CardSection 垂直堆叠，无 Tab 切换、无折叠、无侧边锚点导航，一滚到底                                  | 🔴     |
| B2   | **卡片视觉无层次**     | 所有 CardSection 使用相同的 bg/border/radius，用户扫一眼分不清哪个是"执行信息"哪个是"状态与风险"          | 🔴     |
| B3   | **Header 拥挤**        | 标题 + 状态标签 + 优先级标签 + 催办 + 流转 + 操作 + 关闭，共 7 个元素挤在一行；Drawer 宽度仅 680px 时溢出 | 🟡     |
| B4   | **保存按钮突兀**       | 底部突然冒出一个吸底卡片，视觉不连贯                                                                      | 🟡     |
| B5   | **流转日志只靠背景色** | 最新一条 `bgcolor: primary-15`，其余透明，无时间轴连线，看不出流转顺序                                    | 🟡     |
| B6   | **检查项无进度**       | 只有 ✓/✗ 列表，无进度条、无"一键全完成"、无分步分组                                                       | 🟡     |
| B7   | **附件列表单调**       | 每行只显示文件名 + 大小，无文件类型图标，一堆 .pdf 分不出来                                               | 🟡     |
| B8   | **内联 Drawer 样式**   | TaskManagementPage 中 Drawer 的背景色 `#051338` 和边框 `rgba(255,255,255,0.08)` 硬编码，未使用 CSS 变量   | 🟡     |

### 建议改造方向

1. **Tab 切换替代长滚动** — "基本信息 / 执行 / 检查项 / 文档" 四个 Tab
2. **卡片加颜色标识** — 左边 3px 色条区分（蓝=信息 / 橙=风险 / 绿=检查）
3. **流转日志用 Timeline 组件** — 竖线 + 圆点连接，最新 ∈ 顶部
4. **检查项加进度条** — `████████░░░░░░  3/8·38%`
5. **Header 瘦身** — 标题+状态一行，元数据+操作按钮一行
6. **保存按钮融入 Sticky Bottom Bar** — 常驻底部，有变更时高亮，无变更时淡出

---

## 三、逻辑 Bug

| 编号 | 问题                                 | 具体位置                                                                                                                                | 严重度 |
| ---- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| C1   | **`getPredecessorTasks` 逻辑错误**   | `taskStateMachine.guards.ts:284` — 使用已废弃的 `parentPath` 字段推断前置任务，而非查询 `task_relations` 表                             | 🔴     |
| C2   | **`isBlockedStatus` 永远返回 false** | `taskStateMachine.guards.ts:304` — 占位实现，阻塞任务功能完全不工作                                                                     | 🔴     |
| C3   | **草稿状态不同步**                   | `TaskDetailPage.tsx:216-220` — 切换查看不同任务时，`assigneeDraft`、`plannedStartAt` 等状态不重置，上一个任务的编辑值残留               | 🟡     |
| C4   | **`statusDraft` 初始化逻辑冗余**     | `TaskDetailPage.tsx:220 + 561` — `statusDraft` 从 `taskDetail.status` 初始化，首次渲染时 `statusDraft !== taskDetail.status` 恒为 false | 🟡     |
| C5   | **`owner`/`assigneeName` 混用**      | `taskStateMachine.guards.ts:77, 129` — 代码同时引用已废弃的 `owner` 字段和当前 `assigneeName` 字段                                      | 🟡     |

---

## 四、性能问题

| 编号 | 问题                                 | 详情                                                                                                        | 严重度 |
| ---- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------- | ------ |
| D1   | **缺少 useCallback**                 | `handleSave`、`handleStatusChange`、`handleAttachmentUpload` 均未包裹 `useCallback`，每次渲染创建新函数引用 | 🟡     |
| D2   | **`getStatusTone` 重复创建**         | 定义在组件体内且未 memoize，每次渲染重建                                                                    | 🟡     |
| D3   | **`statusActions` 重复创建**         | 大型 switch-case 函数在组件体内每次渲染重建                                                                 | 🟡     |
| D4   | **`buildTaskDetailFromItem` 无缓存** | 每次调用创建新的 checklist/attachments/relations/flowLogs 数组，GC 压力大                                   | 🟢     |
| D5   | **`PRIORITY_CONFIG` 间接依赖**       | 定义在组件外部但访问组件内 `COLORS` 对象，耦合不透明                                                        | 🟢     |

---

## 五、关联问题（非 TaskDetailPage 本体但影响详情页）

| 编号 | 问题                          | 位置                                         | 严重度 |
| ---- | ----------------------------- | -------------------------------------------- | ------ |
| E1   | **Drawer 尺寸硬编码 680px**   | `TaskManagementPage.tsx:184` — 无响应式适配  | 🟡     |
| E2   | **"新建任务"按钮无 onClick**  | `TaskToolbar.tsx:186` — 死按钮               | 🟡     |
| E3   | **详情页 loading/空状态缺失** | 无骨架屏或 loading spinner，数据切换时有闪烁 | 🟢     |

---

## 决策记录（待定）

| 决策项                            | 选项                                 | 状态   |
| --------------------------------- | ------------------------------------ | ------ |
| 是否拆分组件                      | 是（已建议方案）/ 先修复 bug 再说    | ⏸ 待定 |
| Tab 切换 vs 折叠面板（Accordion） | Tab 更适合 4 区场景                  | ⏸ 待定 |
| 流转日志 Timeline 组件来源        | 手写 VS MUI Timeline                 | ⏸ 待定 |
| 优先级顺序                        | Bug 优先（C1-C5）/ 样式优先（B1-B8） | ⏸ 待定 |

---

## 参考文件

- 主文件: `src/components/task/TaskDetailPage.tsx`
- 类型定义: `src/components/task/taskManagement.types.ts`
- 状态机守卫: `src/components/task/taskStateMachine.guards.ts`
- 页面容器: `src/components/task/TaskManagementPage.tsx`
- 设计规范: `docs/00-governance/design-specification.md`
- 编码规范: `docs/00-governance/coding-standards.md`
