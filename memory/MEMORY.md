# MEMORY.md — 项目长期记忆

> 最后更新: 2026-05-12
> 用途: 跨会话持久化项目架构、决策和待办

## 项目概览

**连锁门店建设管理系统** — 管理从选址、设计、施工到验收的全链条项目。

- 前端: React + Vite + TypeScript + Tailwind CSS (shadcn/ui + @base-ui/react)
- 后端 V1: Express + SQLite (local-api, port 3100)
- 路由: HashRouter (hash 模式)
- 状态管理: Zustand

## 关键架构决策

1. **shadcn/ui + @base-ui/react** 为主 UI 方案，MUI v9 仅作维护
2. **Tailwind CSS v4** — 以 CSS-first 配置替代 JS 配置
3. **三层文档架构** — 人类文档层 / AI 合约层 / 知识引擎层
4. **Harness 工程框架** — 治理即代码，含自适应评估引擎 (L2.5)

## 活跃自动化

- GitHub Actions: CI (push/PR), 每日摘要 (Mon-Fri 18:00), 每周考核 (Fri 17:00), 每月全景 (1st 09:00)
- Trae Schedule: 每日健康检查 (Mon-Fri 09:00), 每周自适应评估 (Fri 17:00), 每周文档同步检查 (Mon 09:00)

## 当前待办

- 维持 memory/ 目录的日常更新
- 确保 AGENTS.md 启动清单覆盖完整

## 技术债

- evaluate-adjustments.py 已首次运行（2026-05-12），持续关注输出质量
- memory/ 目录为本会话初始化，后续会话需自行更新
