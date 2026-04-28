# ADR-002: FeatureRegistry — 统一页面注册模式

> **状态**: Accepted  
> **日期**: 2026-04-28  
> **决策者**: 架构团队  
> **受影响模块**: `src/config/routes.ts`, `src/config/navigation.ts`

---

## 背景

新增一个页面需要开发者在多个文件中重复配置：

| 步骤 | 文件            | 操作                                       |
| ---- | --------------- | ------------------------------------------ |
| 1    | `routes.ts`     | 添加 lazy import + ROUTE_PATHS 常量        |
| 2    | `routes.ts`     | 扩展 AppRoute 联合类型                     |
| 3    | `routes.ts`     | 添加 pageComponentRegistry 条目            |
| 4    | `routes.ts`     | 添加 readRouteFromHash 解析分支            |
| 5    | `routes.ts`     | 添加到 SIMPLE_PAGES / PARAM_PAGES 分类数组 |
| 6    | `navigation.ts` | 添加 goToXxx 导航函数                      |

这种分散式注册容易遗漏，且开发者需要先在脑子里过一遍"到底要改几个文件"。

## 决策

引入 `FeatureConfig` 类型 + `FEATURE_REGISTRY` 数组，将页面注册信息集中到一处。

### 核心设计

```ts
// src/config/feature-registry.ts
export type FeatureConfig = {
  page: string // AppRoute 区分符
  path: string // hash 路径
  component?: ComponentType<any> // 组件
  label?: string // 导航名称
  category?: 'simple' | 'param' | 'callback' | 'data' // AppRouter 分类
}
```

```ts
// routes.ts
export const FEATURE_REGISTRY: FeatureConfig[] = [
  {
    page: 'tasks',
    path: '#/tasks',
    component: TaskManagementPage,
    label: '任务管理',
    category: 'simple',
  },
  // ...
]
```

### 分类数组自动派生

`SIMPLE_PAGES`, `PARAM_PAGES`, `CALLBACK_PAGES`, `DATA_PAGES` 从 `FEATURE_REGISTRY` 自动生成，不再需要手动维护重复列表。

### 保留不变的部分

- `readRouteFromHash` 函数（复杂的 hash 解析逻辑）
- `ROUTE_PATHS` 常量
- `AppRoute` 联合类型
- `navigation.ts` 中的 goToXxx 函数

## 影响

### 正面

- **单点注册**：新增页面只需在 `FEATURE_REGISTRY` 加一行 + `readRouteFromHash` 加一个解析分支
- **消除重复**：分类数组自动派生，不存在"加了 SIMPLE_PAGES 忘了加 PARAM_PAGES"
- **类型安全**：`FeatureConfig` 类型约束 page/path 的对应关系

### 负面

- **增加间接层**：对于只有几个页面的小项目，这个模式多余，但本项目已有 18+ 页面
- **循环依赖风险**：`feature-registry.ts` 不能导入 `routes.ts`（已通过将 registry 定义在 routes.ts 中解决）

## 选项

| 方案                                                            | 优点                         | 缺点                                    |
| --------------------------------------------------------------- | ---------------------------- | --------------------------------------- |
| **当前方案**：定义在 routes.ts，使用 feature-registry.ts 的类型 | 无循环依赖，现有代码无需大改 | 配置与解析仍在同一文件                  |
| 独立 registry 文件 + 组件映射函数                               | 完全解耦                     | 需用字符串 map 绕开循环依赖，增加间接性 |
| 不引入 registry，直接改进现有 pageComponentRegistry             | 改动最小                     | 分类数组仍需手动维护                    |

## 后续

- 将 `navigation.ts` 简化：简单页面的 goToXxx 函数可从 registry 自动生成
- 将 `readRouteFromHash` 按模块拆分，减少单文件 360 行的体量
- 新页面模板：创建新页面时，第一步在 `FEATURE_REGISTRY` 注册

---

**ADR 维护者**: 架构团队  
**下次审查**: 2026-07-28
