# Icon 图标组件系统

## 概述

统一的图标组件系统，提供语义化的图标访问方式，告别硬编码路径。

## 使用方式

### 基础用法

```tsx
import { Icon } from '@/components/shared';

// 基础图标
<Icon name="search" />
<Icon name="notification" />
<Icon name="add" />

// 指定尺寸
<Icon name="search" size="sm" />  // 16px
<Icon name="search" size="md" />  // 20px (默认)
<Icon name="search" size="lg" />  // 24px
<Icon name="search" size="xl" />  // 32px

// 自定义尺寸
<Icon name="search" size={18} />

// 自定义样式
<Icon name="add" className="custom-icon" style={{ color: 'red' }} />
```

## 图标列表

### 导航图标

| 名称               | 说明     |
| ------------------ | -------- |
| `dashboard`        | 工作台   |
| `projects`         | 项目管理 |
| `tasks`            | 任务管理 |
| `customers`        | 客户管理 |
| `contracts`        | 合同结算 |
| `procurement`      | 采购管理 |
| `orders`           | 订单管理 |
| `facility`         | 设施管理 |
| `standards`        | 标准管理 |
| `personnel`        | 人员管理 |
| `digital-employee` | 数字员工 |
| `settings`         | 系统设置 |

### 操作图标

| 名称           | 说明     |
| -------------- | -------- |
| `search`       | 搜索     |
| `notification` | 通知     |
| `ai-assistant` | AI助手   |
| `user-avatar`  | 用户头像 |
| `add`          | 添加     |
| `edit`         | 编辑     |
| `delete`       | 删除     |
| `save`         | 保存     |
| `refresh`      | 刷新     |
| `filter`       | 筛选     |

### 状态图标

| 名称      | 说明   |
| --------- | ------ |
| `success` | 成功   |
| `error`   | 错误   |
| `warning` | 警告   |
| `info`    | 信息   |
| `loading` | 加载中 |

## API

### Icon Props

| 属性        | 类型                                             | 默认值 | 说明       |
| ----------- | ------------------------------------------------ | ------ | ---------- |
| `name`      | `IconName`                                       | 必填   | 图标名称   |
| `size`      | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| number` | `'md'` | 图标尺寸   |
| `className` | `string`                                         | `''`   | 自定义类名 |
| `style`     | `CSSProperties`                                  | -      | 自定义样式 |
| `alt`       | `string`                                         | `''`   | 替代文本   |

## 添加新图标

1. 将 SVG 文件放入 `/assets/CodeBubbyAssets/3990_3/` 目录
2. 在 `index.ts` 的 `iconPaths` 中添加映射：

```typescript
export const iconPaths: Record<IconName, string> = {
  // ... 已有图标
  'new-icon': '/assets/CodeBubbyAssets/3990_3/99.svg',
}
```

3. 在 `IconName` 类型中添加新名称：

```typescript
export type IconName = 'existing-icon' | 'new-icon' // 添加新名称
```
