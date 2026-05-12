---
id: AI-CODING-STANDARDS
human_source: docs/00-governance/coding-standards.md
status: active
last_synced: 2026-05-11
---

# AI 合约：代码规范

## 铁律

1. 禁止 `any`（需 eslint-disable + 理由）
2. 禁止硬编码色值/间距/圆角
3. 禁止绕过状态机守卫
4. 禁止子组件直接操作 localStorage
5. 路由跳转用 navigation.ts goTo\*
6. 数据操作通过 Repository/Store 层
7. 禁止 `console.log`
8. 禁止 `@ts-ignore` / `@ts-expect-error`

## 工具配置

| 工具     | 关键配置                                                            | 配置源              |
| -------- | ------------------------------------------------------------------- | ------------------- |
| ESLint   | `no-console: warn`, `no-explicit-any: warn`, `no-unused-vars: warn` | `eslint.config.js`  |
| Prettier | no-semi, singleQuote, printWidth 100, arrowParens avoid             | `.prettierrc`       |
| TS       | strict, noUnusedLocals, noUnusedParameters, `@/*` → `src/*`         | `tsconfig.app.json` |

## TypeScript 规则

- 对象类型用 `interface`，联合类型用 `type`
- Props 必须显式接口，禁止 `React.FC`
- 默认值解构赋值，回调 `onXxx` 命名

## React 组件

- 结构顺序：imports → Props → hooks → handlers → render → JSX
- 300 行上限，超标必须拆分
- 复合组件模式

## 架构约束

```
components → store → services → domain
共享组件不可引用服务层/领域层
领域层禁止引用组件层
```

## 双栈规范

| 栈                 | UI        | 样式        | 路由            | 状态    |
| ------------------ | --------- | ----------- | --------------- | ------- |
| src/ (MUI)         | MUI v9    | CSS 变量    | Hash            | Zustand |
| src-next/ (shadcn) | shadcn/ui | Tailwind v4 | React Router v7 | Zustand |

## Git 提交

格式：`<type>(<scope>): <subject>`（feat/fix/docs/refactor/style/perf/test/chore）
分支：`<type>/<scope>-<description>`

## 交付验收

- [ ] 无 `any`（或有 eslint-disable 理由）
- [ ] 无硬编码色值
- [ ] 无 `console.log`
- [ ] 无死代码/过度抽象
- [ ] `npm run lint` 0 errors
- [ ] `npm run build` 0 errors
