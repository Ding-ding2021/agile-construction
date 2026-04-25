# 项目开发规范

## 代码规范

### 命名规范

| 类型      | 规范             | 示例                                    |
| --------- | ---------------- | --------------------------------------- |
| 组件      | PascalCase       | `ProjectDetailPage`, `TaskCard`         |
| 函数/变量 | camelCase        | `getProjectById`, `isLoading`           |
| 常量      | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `API_BASE_URL`       |
| 类型/接口 | PascalCase       | `ProjectItem`, `TaskStatus`             |
| 文件      | kebab-case       | `use-project.ts`, `task-management.tsx` |
| Hook      | use + PascalCase | `useTaskStatus`, `useProjectList`       |

### 文件组织

```
components/
├── project/
│   ├── project-detail-page.tsx      # 页面组件
│   ├── project-card.tsx             # 卡片组件
│   ├── project-status-badge.tsx     # 徽章组件
│   ├── project.hooks.ts             # 组件级 hooks
│   └── project.types.ts             # 组件级类型
```

### 导入顺序

```typescript
// 1. React 内置
import React, { useState, useEffect } from 'react'

// 2. 第三方库
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'

// 3. 绝对路径导入
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

// 4. 相对路径导入
import { ProjectCard } from './project-card'
import type { Project } from './project.types'
```

## 组件开发规范

### 函数组件

```typescript
// ✅ 推荐：函数声明 + 导出
export function TaskCard({ task, onClick }: TaskCardProps) {
  const handleClick = useCallback(() => {
    onClick?.(task.id);
  }, [onClick, task.id]);

  return (
    <div onClick={handleClick}>
      <h3>{task.title}</h3>
    </div>
  );
}

// ❌ 避免：匿名函数
export default ({ task }) => { ... }
```

### Props 定义

```typescript
// ✅ 推荐：明确接口
interface TaskCardProps {
  task: Task;
  onClick?: (taskId: string) => void;
  showActions?: boolean;
}

// ❌ 避免：any 或隐式类型
function TaskCard(props: any) { ... }
```

### 条件渲染

```typescript
// ✅ 推荐：提前返回
if (loading) return <Skeleton />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState />;

return <Content data={data} />;

// ✅ 推荐：三元表达式（简单情况）
{isEditing ? <EditForm /> : <ViewMode />}

// ❌ 避免：复杂逻辑内联
{(() => {
  if (a) return <A />;
  if (b) return <B />;
  return <C />;
})()}
```

## Git 规范

### 分支命名

```
main                    # 生产分支
develop                 # 开发分支
feature/task-detail     # 功能分支
bugfix/login-error      # 修复分支
hotfix/critical-bug     # 热修复分支
```

### Commit 格式

```
type(scope): subject

body (可选)

footer (可选)
```

**type:**

- `feat`: 新功能
- `fix`: 修复
- `docs`: 文档
- `style`: 格式（不影响代码运行）
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建/工具

**示例:**

```
feat(project): 添加项目状态机守卫规则

- 实现里程碑检查
- 实现任务树完整性检查

Closes #123
```

## 代码审查清单

### 提交前自检

- [ ] 代码能正常运行
- [ ] 无 console.log 调试代码
- [ ] ESLint 无错误
- [ ] TypeScript 无类型错误
- [ ] 无死代码/注释掉的代码

### 审查关注点

- [ ] 逻辑正确性
- [ ] 边界条件处理
- [ ] 性能问题（重复计算、不必要的渲染）
- [ ] 安全问题（XSS、注入）
- [ ] 可测试性
- [ ] 命名清晰度

## 文档规范

### 代码注释

```typescript
/**
 * 检查项目是否可以流转到目标状态
 * @param from - 当前状态
 * @param to - 目标状态
 * @param context - 守卫上下文
 * @returns 是否允许转换
 * @example
 * canTransition('PENDING', 'IN_PROGRESS', { hasMilestone: true })
 */
function canTransition(from: ProjectStatus, to: ProjectStatus, context: GuardContext): boolean {
  // ...
}
```

### 组件文档

```typescript
/**
 * ProjectCard - 项目卡片组件
 *
 * 用于在项目列表中展示项目概要信息
 *
 * @example
 * <ProjectCard
 *   project={project}
 *   onClick={handleProjectClick}
 *   showProgress
 * />
 */
```

## 性能规范

1. **避免在 render 中创建新对象/函数**
2. **大数据量使用虚拟列表**
3. **图片懒加载**
4. **路由懒加载**
5. **合理使用 useMemo/useCallback**
