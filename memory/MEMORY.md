# MEMORY.md — 项目长期记忆

> 最后更新: 2026-05-14
> 用途: 跨会话持久化项目架构、决策和待办

## 项目概览

**数字营建项目** — 管理从选址、设计、施工到验收的全链条门店建设项目。

- 前端: React + Vite + TypeScript + Tailwind CSS (shadcn/ui + @base-ui/react)
- 后端 V1: Express + SQLite (local-api, port 3100)
- 路由: HashRouter (hash 模式)
- 状态管理: Zustand

## 关键架构决策

1. **shadcn/ui + @base-ui/react** 为主 UI 方案，MUI v9 仅作维护
2. **Tailwind CSS v4** — 以 CSS-first 配置替代 JS 配置
3. **三层文档架构** — 人类文档层 / AI 合约层 / 知识引擎层（2026-05-13: L1 产品规划 + L2 V1 产品定义已就位，L3 引用已对齐）
4. **Harness 工程框架** — 治理即代码，含自适应评估引擎 (L2.5)
5. **任务驱动模型** — 项目没有独立状态机，状态从任务聚合推导。任务状态：草稿→待分配→执行中→待验收→已完成（2026-05-13 确立）
6. **五条技能调用链** — 需求定义链 / 规划链 / 执行链 / 验收上线链 / 文档维护链。产出物即下一链触发信号（2026-05-13 设计）
7. **intent-orchestrator 引导技能** — 常驻技能，分类用户意图后自动触发对应技能链（设计阶段，待实现）

## 活跃自动化

- GitHub Actions: CI (push/PR), 每日摘要 (Mon-Fri 18:00), 每周考核 (Fri 17:00), 每月全景 (1st 09:00)
- Trae Schedule: 每日健康检查 (Mon-Fri 09:00), 每周自适应评估 (Fri 17:00), 每周文档同步检查 (Mon 09:00)

## 当前待办

- 维持 memory/ 目录的日常更新
- 确保 AGENTS.md 启动清单覆盖完整
- **Phase 6 引擎实施计划编写**（标准/任务/项目/人员/采购）
- **Phase 7 共享组件技术选型**（WbsTreeTable / GanttChart 方案评估）
- **验收管理、系统设置模块梳理**（后续会议议题）

## 2026-05-14 关键更新

- 8 个模块全部纳入开发计划（标准/任务/项目/人员/采购/工队/地理/Agent）
- 开发计划 V2.4 发布：92 个任务，5 个 Phase（6~10）
- Agent 架构设计完成：Harness + MCP + Skills 三层体系，11 个 Skills
- 文档归档：3 个过期文件移入 99-archive，16 处引用修复
- Git 6 个原子提交已推送

## 技术债

- evaluate-adjustments.py 已首次运行（2026-05-12），持续关注输出质量
- memory/ 目录为本会话初始化，后续会话需自行更新
- MCP Memory 服务已初始化（sqlite_vec，.memory/），写入 10 条记忆块（产品规划 L1），embedding 模型正常（all-MiniLM-L6-v2, MPS 加速）。需新会话验证跨会话检索
