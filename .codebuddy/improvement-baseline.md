# 改进计划基线文档

## 一、体积基线（2026-04-14）

### 当前构建产物

```
dist/index.html                   0.68 kB │ gzip:   0.42 kB
dist/assets/index-B64sBEtp.css  227.58 kB │ gzip:  31.94 kB
dist/assets/index--L21y043.js   571.44 kB │ gzip: 149.95 kB
```

### 问题

- **主包超标**：571.44 KB 超出 Vite 默认 500KB 警告线
- **首包体积大**：所有页面组件同步加载，首屏渲染慢
- **缺少拆分**：无 manualChunks 配置，基础库未分离

### 目标

- 主包体积：**≤350KB**（理想 ≤300KB）
- 降幅：**约 40%**
- 首屏加载时间：减少 30-50%

## 二、测试基线

### 当前状态

- 测试框架：**无**
- 测试用例：**0**
- 覆盖率：**0%**

### 目标

- 测试框架：**Vitest**
- 核心域覆盖：15-20 用例
  - projectStatusMachine（状态机）
  - projectRepository（仓储层）
  - local-api 幂等逻辑

## 三、错误治理基线

### 当前问题

- 静默降级：部分异常 catch 后不抛出
- 日志不统一：缺少结构化字段
- 排障成本高：无法快速定位问题根因

### 目标错误模型

```typescript
interface StructuredError {
  code: string // 错误码：NETWORK_ERROR | VALIDATION_ERROR | BUSINESS_ERROR
  scope: string // 作用域：api | repository | domain
  scenario: string // 场景：create-project | update-status | sync-acceptance
  status?: number // HTTP 状态码
  idempotencyKey?: string // 幂等键（如有）
  at: string // 时间戳 ISO 8601
  message: string // 用户友好消息
  raw?: unknown // 原始错误
}
```

## 四、文档基线

### 当前状态

- README.md：Vite 模板内容，未反映业务架构
- 缺少联调指南、回归清单

### 目标

- 重写 README.md（架构、启动、联调、问题排查）
- 补充阶段文档（本地后端、测试运行）

## 五、优化策略

### 1. 性能优化（Day 1-2）

- [ ] 路由级懒加载（React.lazy + Suspense）
- [ ] Vite manualChunks 配置（React、图表库拆分）
- [ ] 资源按需加载
- [ ] 无效依赖清理

### 2. 测试补强（Day 2-3）

- [ ] 引入 Vitest
- [ ] 核心域测试用例（15-20 条）
- [ ] CI 门禁配置

### 3. 错误治理（Day 4）

- [ ] 统一错误模型
- [ ] API/Repository 层错误结构化
- [ ] 关键链路日志增强

### 4. 文档收口（Day 5）

- [ ] 重写 README.md
- [ ] 联调指南
- [ ] 回归清单
