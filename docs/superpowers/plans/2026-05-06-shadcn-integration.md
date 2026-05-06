# shadcn 规范化接入 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate `src-next/` (shadcn) into the root project via npm workspace, clean up `@/` redundancy, and update documentation to reflect shadcn as the primary UI framework.

**Architecture:** npm workspace hoists shared deps (react, vite, typescript) to root `node_modules/`, `src-next/` keeps its shadcn-specific deps. Root tsconfig/eslint extended to cover `src-next/`. All new development in `src-next/`, `src/` (MUI) is bugfix-only.

**Tech Stack:** npm workspaces, shadcn/ui base-nova, Tailwind CSS v4, React Router v7 BrowserRouter

---

### Task 1: Delete `@/` redundant directory

**Files:**
- Delete: `@/` (entire directory tree)

- [ ] **Step 1: Remove `@/` directory**

```bash
rm -rf @/
```

- [ ] **Step 2: Verify deletion**

```bash
ls @/ 2>&1 || echo "确认删除成功"
```

Expected: `ls: @/: No such file or directory`

- [ ] **Step 3: Check no imports reference `@/` outside src-next**

```bash
rg "@/" --include='*.{ts,tsx}' --no-ignore -g '!src-next/**' -g '!node_modules/**'
```

Expected: no matches (only `src-next/` uses `@/` alias)

---

### Task 2: Add npm workspace config

**Files:**
- Modify: `package.json` (root)
- Modify: `src-next/package.json`

- [ ] **Step 1: Add workspaces field to root `package.json`**

Insert `"workspaces": ["src-next"]` after `"type": "module"`:

Edit `package.json` (root):
```json
  "type": "module",
  "workspaces": ["src-next"],
```

- [ ] **Step 2: Run npm install to hoist dependencies**

```bash
npm install
```

Expected: npm links `src-next/` as workspace, hoists shared deps to root `node_modules/`. No errors.

---

### Task 3: Add dev/build scripts for src-next

**Files:**
- Modify: `package.json` (root) — scripts section

- [ ] **Step 1: Add `dev:next` and `build:next` scripts**

Edit `package.json` (root) — add after `"db:seed"`:

```json
    "dev:next": "npm run dev -w src-next",
    "build:next": "npm run build -w src-next",
```

- [ ] **Step 2: Verify scripts are registered**

```bash
npm run | grep next
```

Expected: shows `dev:next` and `build:next`

---

### Task 4: Create tsconfig for src-next

**Files:**
- Create: `src-next/tsconfig.json`

- [ ] **Step 1: Create `src-next/tsconfig.json`**

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2023",
    "useDefineForClassFields": true,
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,

    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["."]
}
```

---

### Task 5: Update root tsconfig to include src-next

**Files:**
- Modify: `tsconfig.app.json`

- [ ] **Step 1: Add `src-next` to include array**

```json
  "include": ["src", "src-next"]
```

- [ ] **Step 2: Verify root type-check covers both**

```bash
npx tsc -b --noEmit 2>&1 | head -30
```

Expected: no type errors related to `src-next/` being unaccounted

---

### Task 6: Update eslint config

**Files:**
- Modify: `eslint.config.js`

- [ ] **Step 1: Ensure eslint covers src-next**

The current config has `files: ['**/*.{ts,tsx}']` which already matches `src-next/`. No change needed for file pattern.

Add ignore exemption if needed — check if any `src-next/` files trigger false positives by running:

```bash
npx eslint src-next/ --max-warnings 0
```

Expected: passes or minimal warnings. If there are shadcn-specific false positives (e.g., unused vars in generated component code), add an override:

```js
  {
    files: ['src-next/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
```

Add this only if lint fails.

- [ ] **Step 2: Add `src-next/dist` and `src-next/node_modules` to globalIgnores**

```js
globalIgnores(['dist', 'src/generated/prisma', 'src-next/dist', 'src-next/node_modules']),
```

---

### Task 7: Update AGENTS.md

**Files:**
- Modify: `AGENTS.md`

- [ ] **Step 1: Add `dev:next` to common commands**

Add after `npm run test:run`:
```
- `npm run dev:next` — 启动 shadcn 开发服务器（端口 5174）
- `npm run build:next` — 构建 shadcn 生产版本
```

- [ ] **Step 2: Rewrite "架构速查" table**

Replace the MUI-centric table with shadcn equivalents:

| 做什么 | 找这里 |
|-------|--------|
| 改路由 / 加页面 | `src-next/App.tsx` → BrowserRouter `<Routes>` |
| 改导航跳转 | `src-next/components/app-sidebar.tsx` → nav items |
| 改全局样式与 Token | `src-next/index.css` → `@theme` + CSS 变量 |
| 改 shadcn 组件 | `src-next/components/ui/` → 对应组件 |
| 改业务组件 | `src-next/components/` → domain 子目录 |
| 改任务页面 | `src-next/pages/tasks/` |
| 改数据层 | `src-next/services/api.ts` |
| 改类型定义 | `src-next/types/` |
| 查 UI 设计规范 | `docs/01-product/design-spec-v2-shadcn.md` |
| 查编码规范 | `docs/00-governance/coding-standards.md` |
| 查项目计划 | `docs/PLAN.md` |

- [ ] **Step 3: Update "项目约定" section**

Replace MUI-specific items:
- Remove: `UI 库: MUI v9 + Emotion`
- Add: `UI 库: shadcn/ui (base-nova) + @base-ui/react`
- Update route description: 路由: BrowserRouter (`/tasks`, `/projects`, `/personnel` 等)
- Update styles: Tailwind CSS v4 oklch 色值，`@theme` 指令
- Add note: src/ (MUI) is in maintenance mode — only bugfix, no new development

- [ ] **Step 4: Update "红线约束"**

Add:
- `禁止`在 `src/`（MUI）中新增功能代码 — 新功能一律在 `src-next/` 开发
- `禁止`直接修改 `src-next/node_modules/` 下的任何文件

---

### Task 8: Update PLAN.md

**Files:**
- Modify: `docs/PLAN.md`

- [ ] **Step 1: Update current status**

Edit the "当前状态" table `当前阶段` to reflect the shadcn integration progress.

- [ ] **Step 2: Mark shadcn integration complete**

Add decision record entry for 2026-05-06:
```
| 2026-05-06 | shadcn 工作区接入完成 | src-next/ 通过 npm workspace 纳入根项目 |
```

- [ ] **Step 3: Check off completed todo**

Change `- [ ] src-next/ 测试基础设施搭建（vitest + testing library）` to `- [x]` if vitest config already exists in `src-next/vitest.config.ts`.

---

### Task 9: Verify the setup

- [ ] **Step 1: Run lint over both src and src-next**

```bash
npm run lint 2>&1
```

Expected: 0 errors, acceptable warnings

- [ ] **Step 2: Run typecheck**

```bash
npx tsc --noEmit 2>&1
```

Expected: no type errors

- [ ] **Step 3: Start dev server briefly to verify**

```bash
timeout 10 npm run dev:next 2>&1 || true
```

Expected: vite dev server starts, no import resolution errors

- [ ] **Step 4: Clean up src-next node_modules if workspace duplication**

```bash
rm -rf src-next/node_modules && npm install
```

Only if step 2 reveals hoisting issues.
