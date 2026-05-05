# shadcn 组件开发工作流

## 三阶段流程

1. **调研** — shadcn MCP 工具搜索官方 registry
2. **原型** — web-artifacts-builder（可选）
3. **添加** — `npx shadcn@latest add -c src-next` + 修复自引用

## 设计约束

- 使用 `cn()` 合并 Tailwind 类
- 颜色用 oklch 色值，禁止 HEX
- 禁止 `--pm-*` 旧品牌色
- 组件 variant 使用 shadcn 默认
- 图标通过 `Icon` 适配层引用，统一 16px

详见 `docs/01-product/design-spec-v2-shadcn.md`
