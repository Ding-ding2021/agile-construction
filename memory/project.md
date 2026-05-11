---
description: >-
  The project block: Stores durable, high-signal information about this codebase: commands, architecture notes,
  conventions, and gotchas.
label: project
limit: 5000
read_only: false
---
# 项目速查
- **UI 主栈**: shadcn/ui (base-nova) + @base-ui/react（src-next/）
- **UI 副栈（维护模式）**: MUI v9 + Emotion（src/），仅修 bug
- **路由**: React Router v7 BrowserRouter（/tasks, /projects, /personnel）
- **状态管理**: Zustand + persist（localStorage key pm-projects-state-v1）
- **后端**: local-api/（Node.js + Express + better-sqlite3 + Prisma），端口 3100
- **样式**: Tailwind CSS v4 oklch，`@theme` 指令
- **类型检查**: tsc --noEmit
- **Lint**: eslint flat config
- **测试**: Vitest（src-next/）+ Playwright E2E
- **构建**: npm run build（shadcn）/ npm run build:legacy（MUI）
- **红线**: 禁止修改 src/ 加功能；禁止绕过 canTransition 守卫；禁止子组件直接 localStorage.setItem
