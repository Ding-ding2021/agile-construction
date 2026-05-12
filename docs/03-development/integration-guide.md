---
id: DOC-03-ENGINEERING-INTEGRATION-GUIDE
number: DEV-013
domain: development
category: guide
title: 本地联调指南
owner: docs-maintainer
status: active
last_updated: 2026-04-16
source_of_truth: true
related_code: []
related_docs: []
---

# 本地联调指南

## 🎯 目标

指导开发者完成本地环境的搭建、联调测试和问题排查。

---

## 一、环境准备

### 1.1 系统要求

- **操作系统**：macOS、Windows、Linux
- **Node.js**：≥ 18.0.0（推荐 20.x LTS）
- **npm**：≥ 9.0.0
- **浏览器**：Chrome、Firefox、Safari、Edge 最新版

### 1.2 验证环境

```bash
# 检查 Node.js 版本
node --version

# 检查 npm 版本
npm --version
```

---

## 二、项目启动

### 2.1 克隆项目

```bash
git clone <repository-url>
cd <project-name>
```

### 2.2 安装依赖

```bash
npm install
```

**预期输出**：

```
added 500+ packages in 10s
```

### 2.3 启动开发服务器

#### 方式一：仅前端（推荐用于 UI 开发）

```bash
npm run dev
```

**访问地址**：`http://localhost:5173`

**说明**：

- 前端运行在 5173 端口
- 无本地后端，使用 localStorage 作为数据源
- 适合快速预览和 UI 调整

#### 方式二：前端 + 本地后端（推荐用于完整联调）

```bash
npm run dev:local
```

**访问地址**：

- 前端：`http://localhost:5173`
- 后端：`http://localhost:3100`

**说明**：

- 前端运行在 5173 端口
- 本地后端运行在 3100 端口
- 所有 `/api/*` 请求自动代理到本地后端
- 支持数据持久化（SQLite 数据库）

---

## 三、接口联调

### 3.1 核心接口列表

| 接口                  | 方法 | 说明         |
| --------------------- | ---- | ------------ |
| `/api/projects/state` | GET  | 获取项目状态 |
| `/api/projects/state` | PUT  | 保存项目状态 |
| `/api/tasks/state`    | GET  | 获取任务状态 |
| `/api/tasks/state`    | PUT  | 保存任务状态 |
| `/api/audit/logs`     | POST | 记录审计日志 |

### 3.2 接口验证流程

#### 步骤 1：启动本地后端

```bash
npm run local-api
```

**预期输出**：

```
本地 API 服务已启动在 http://localhost:3100
数据库文件：local-api/local.db
```

#### 步骤 2：启动前端

```bash
npm run dev
```

#### 步骤 3：打开浏览器控制台

1. 访问 `http://localhost:5173`
2. 打开开发者工具（F12）
3. 切换到 **Network（网络）** 标签
4. 刷新页面

#### 步骤 4：验证接口调用

**预期结果**：

- 看到 `GET /api/projects/state` 请求
- 状态码：200 OK
- 响应体包含项目列表

**示例响应**：

```json
{
  "projects": [
    {
      "code": "PRJ-2024-001",
      "name": "深圳万象城开业项目",
      "status": "执行中",
      ...
    }
  ],
  "logs": {}
}
```

### 3.3 幂等性验证

#### 验证幂等键

1. 在 Network 标签中找到 `PUT /api/projects/state` 请求
2. 查看 **Request Headers（请求头）**
3. 确认存在 `X-Idempotency-Key` 头

**示例**：

```
X-Idempotency-Key: project-state-1712985600000-abc123de
```

#### 验证幂等性

1. 修改项目数据并保存
2. 立即再次保存相同数据（使用相同幂等键）
3. 验证第二次请求返回 409 Conflict 或被忽略

---

## 四、功能联调

### 4.1 项目管理联调

#### 创建项目

1. 点击 **新建项目** 按钮
2. 填写项目基本信息
3. 点击 **保存**
4. 验证：
   - 项目列表中显示新项目
   - localStorage 中 `pm-projects-state-v1` 包含新项目
   - 控制台无错误

#### 状态流转

1. 打开项目详情页
2. 点击 **推进状态** 按钮
3. 选择目标状态
4. 验证：
   - 状态成功流转
   - 控制台显示流转日志
   - 守卫条件正确生效

**守卫条件测试用例**：

| 从状态 | 到状态 | 守卫条件           | 测试方法                   |
| ------ | ------ | ------------------ | -------------------------- |
| 待立项 | 待确认 | 需要项目容器       | 清空项目容器，验证无法流转 |
| 待确认 | 待拆解 | 需要立项审批       | 未完成审批，验证无法流转   |
| 待拆解 | 执行中 | 需要里程碑、任务树 | 清空里程碑，验证无法流转   |

### 4.2 任务管理联调

1. 访问 **任务中心**
2. 验证任务列表加载
3. 测试筛选、搜索、排序功能
4. 验证任务详情显示

### 4.3 人员管理联调

1. 访问 **人员管理**
2. 验证人员列表加载
3. 测试人员详情页
4. 验证项目绑定关系

---

## 五、错误处理联调

### 5.1 网络错误模拟

#### 方法一：停止本地后端

```bash
# 停止本地后端（Ctrl+C）
# 然后在前端页面操作
```

**预期结果**：

- 控制台显示降级日志：
  ```
  [降级] scope=project_state_read, scenario=/projects/state, reason=network_error, status=0, key=N/A
  ```
- 用户收到降级提示：`云端服务暂时不可用，已启用本地兜底`
- 数据从 localStorage 加载

#### 方法二：浏览器断网

1. 打开开发者工具
2. 切换到 **Network** 标签
3. 选择 **Offline** 模式
4. 刷新页面

**预期结果**：同上

### 5.2 幂等冲突模拟

1. 修改项目数据并保存
2. 立即再次保存相同数据（使用相同幂等键）
3. 验证控制台显示幂等冲突日志

### 5.3 验证错误测试

1. 尝试创建空项目（不填写名称）
2. 验证表单验证错误提示

---

## 六、性能验证

### 6.1 首屏加载时间

1. 打开开发者工具
2. 切换到 **Performance** 标签
3. 刷新页面并记录
4. 查看 **First Contentful Paint (FCP)** 和 **Largest Contentful Paint (LCP)**

**预期结果**：

- FCP < 1.5s
- LCP < 2.5s

### 6.2 主包体积验证

```bash
npm run build
```

**预期输出**：

```
dist/assets/index-*.js    27.03 kB │ gzip: 10.01 kB
dist/assets/react-vendor-*.js  189.63 kB │ gzip: 59.64 kB
```

### 6.3 懒加载验证

1. 打开开发者工具
2. 切换到 **Network** 标签
3. 刷新页面
4. 查看加载的 JS 文件

**预期结果**：

- 首屏只加载 `index.js` 和 `react-vendor.js`
- 其他页面组件（如 `TaskManagementPage.js`）在访问时才加载

---

## 七、问题排查

### 7.1 接口调用失败

**症状**：控制台显示 `NETWORK_ERROR`

**排查步骤**：

1. 检查本地后端是否启动（`http://localhost:3100`）
2. 检查 Vite proxy 配置（`vite.config.ts`）
3. 检查浏览器 Network 标签，查看请求详情

**解决方案**：

```bash
# 重启本地后端
npm run local-api

# 或使用前端独立模式
npm run dev
```

### 7.2 状态流转失败

**症状**：点击推进状态按钮无反应

**排查步骤**：

1. 打开控制台，查看守卫错误日志
2. 检查项目的守卫条件字段（里程碑、任务树等）
3. 查看 `projectStatusMachine.ts` 中的守卫逻辑

**示例日志**：

```
状态流转失败: 立项审批未完成，无法进入待拆解
```

### 7.3 本地缓存不一致

**症状**：修改数据后未生效

**排查步骤**：

1. 打开开发者工具
2. 切换到 **Application** 标签
3. 查看 **Local Storage** 中的 `pm-projects-state-v1`

**解决方案**：

```javascript
// 清空本地缓存
localStorage.clear()
location.reload()
```

### 7.4 幂等键冲突

**症状**：重复提交相同数据失败

**排查步骤**：

1. 查看 Network 标签中的请求头
2. 确认 `X-Idempotency-Key` 是否相同
3. 检查后端幂等性处理逻辑

**解决方案**：

- 幂等键设计为随机生成，避免冲突
- 如需强制提交，刷新页面生成新幂等键

---

## 八、调试技巧

### 8.1 日志追踪

**关键日志点**：

- API 请求：`[API] ...`
- 降级事件：`[降级] ...`
- 错误日志：`[ERROR] ...`
- 重试日志：`[API] Retrying request ...`

**示例**：

```javascript
// 在 console 中过滤日志
// 只显示降级日志
console.log = new Proxy(console.log, {
  apply(target, thisArg, args) {
    if (args[0]?.includes?.('[降级]')) {
      target.apply(thisArg, args)
    }
  },
})
```

### 8.2 断点调试

1. 打开开发者工具
2. 切换到 **Sources** 标签
3. 找到源文件（如 `src/App.tsx`）
4. 在关键代码行设置断点
5. 刷新页面或触发事件

**推荐断点位置**：

- `src/App.tsx` 的 `transitionProjectStatus` 函数（状态流转）
- `src/services/repositories/projectRepository.ts` 的 `loadState` 函数（数据加载）
- `src/services/api/client.ts` 的 `apiRequest` 函数（API 调用）

### 8.3 React DevTools

1. 安装 React Developer Tools 浏览器扩展
2. 打开开发者工具
3. 切换到 **Components** 标签
4. 查看组件树和 props/state

**用途**：

- 查看项目状态
- 查看路由信息
- 查看 props 传递

---

## 九、自动化测试

### 9.1 运行单元测试

```bash
npm run test
```

**预期输出**：

```
Test Files  3 passed (3)
     Tests  25 passed (25)
  Duration  2.30s
```

### 9.2 测试覆盖率

```bash
npm run test:coverage
```

**预期结果**：

- 核心域覆盖率 > 80%
- 总体覆盖率 > 60%

---

## 十、验收标准

### 10.1 功能验收

- ✅ 所有核心接口联调通过
- ✅ 项目状态流转守卫生效
- ✅ 数据持久化正常（本地后端 + localStorage）

### 10.2 性能验收

- ✅ 首屏加载 < 3s
- ✅ 主包体积 < 350 KB
- ✅ 页面切换流畅

### 10.3 错误处理验收

- ✅ 网络错误降级到本地缓存
- ✅ 错误日志包含完整上下文
- ✅ 幂等性机制生效

---

**指南生成时间**：2026-04-14 09:12  
**适用版本**：v1.0.0  
**维护人**：AI Agent
