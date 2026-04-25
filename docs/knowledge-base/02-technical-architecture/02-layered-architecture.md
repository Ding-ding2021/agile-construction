# 分层架构详解

## 五层架构模型

```
┌────────────────────────────────────┐
│         用户层 (Presentation)        │
│    页面组件 / 视图逻辑 / UI状态       │
├────────────────────────────────────┤
│         应用层 (Application)         │
│    用例编排 / 流程控制 / 事务管理      │
├────────────────────────────────────┤
│         领域层 (Domain)              │
│    领域模型 / 业务规则 / 状态机        │
├────────────────────────────────────┤
│         基础设施层 (Infrastructure)   │
│    数据访问 / 外部服务 / 工具类        │
├────────────────────────────────────┤
│         数据层 (Data)                │
│    数据库 / 缓存 / 消息队列           │
└────────────────────────────────────┘
```

## 各层职责

### 1. 用户层 (Presentation Layer)

**职责：**

- 渲染UI界面
- 处理用户交互
- 管理组件状态

**代码位置：** `src/components/`, `src/pages/`

```typescript
// 示例：用户层组件
export function TaskListPage() {
  const { tasks, loading, filterTasks } = useTaskList();

  return (
    <div>
      <FilterBar onFilter={filterTasks} />
      <TaskTable tasks={tasks} loading={loading} />
    </div>
  );
}
```

**设计原则：**

- 组件只负责展示，业务逻辑下沉
- 使用自定义Hook封装业务逻辑
- 保持组件纯净，便于测试

### 2. 应用层 (Application Layer)

**职责：**

- 编排领域对象完成用例
- 控制业务流程
- 跨领域协调

**代码位置：** `src/application/`, `src/hooks/`

```typescript
// 示例：应用层用例
export function useTaskAssignment() {
  const taskRepo = useTaskRepository()
  const notificationService = useNotificationService()

  const assignTask = async (taskId: string, assigneeId: string) => {
    // 1. 获取领域对象
    const task = await taskRepo.findById(taskId)

    // 2. 执行业务操作
    task.assignTo(assigneeId)

    // 3. 持久化
    await taskRepo.save(task)

    // 4. 发送通知
    await notificationService.notify(assigneeId, {
      type: 'TASK_ASSIGNED',
      taskId,
    })
  }

  return { assignTask }
}
```

### 3. 领域层 (Domain Layer)

**职责：**

- 核心业务逻辑
- 领域模型定义
- 业务规则校验

**代码位置：** `src/domain/`

```typescript
// 示例：领域模型
export class Task {
  private id: string
  private status: TaskStatus
  private assigneeId?: string

  assignTo(userId: string): void {
    // 业务规则校验
    if (this.status !== 'PENDING_ASSIGNMENT') {
      throw new Error('只能分配待分配状态的任务')
    }

    this.assigneeId = userId
    this.status = 'PENDING_EXECUTION'
    this.recordDomainEvent(new TaskAssignedEvent(this.id, userId))
  }
}
```

**核心概念：**

- **实体 (Entity)**：有唯一标识，生命周期长的对象
- **值对象 (Value Object)**：无唯一标识，不可变的对象
- **聚合 (Aggregate)**：一组相关对象的集合
- **领域事件 (Domain Event)**：领域内发生的具有业务意义的事件
- **仓储 (Repository)**：聚合的持久化抽象

### 4. 基础设施层 (Infrastructure Layer)

**职责：**

- 数据持久化实现
- 外部服务调用
- 通用工具提供

**代码位置：** `src/infrastructure/`, `src/data/`

```typescript
// 示例：仓储实现
export class TaskRepositoryImpl implements TaskRepository {
  constructor(private db: Database) {}

  async findById(id: string): Promise<Task> {
    const record = await this.db.query('SELECT * FROM tasks WHERE id = ?', [id])
    return this.toDomain(record)
  }

  async save(task: Task): Promise<void> {
    const record = this.toPersistence(task)
    await this.db.upsert('tasks', record)

    // 发布领域事件
    const events = task.getDomainEvents()
    await this.eventBus.publishAll(events)
  }
}
```

### 5. 数据层 (Data Layer)

**职责：**

- 数据存储与检索
- 数据一致性保障
- 性能优化

**技术选型：**
| 类型 | 技术 | 用途 |
|-----|------|-----|
| 关系型DB | PostgreSQL | 业务数据持久化 |
| 缓存 | Redis | 热点数据加速 |
| 搜索 | Elasticsearch | 全文检索 |
| 对象存储 | OSS/S3 | 文件存储 |

## 层间依赖关系

```
用户层 ──────┐
             │
应用层 ──────┼──→ 领域层 ←──── 基础设施层
             │                ↑
数据层 ──────┘                │
                              └──── 外部服务
```

**依赖原则：**

- 上层依赖下层
- 下层不依赖上层
- 依赖倒置：依赖接口而非实现

## 分层架构优势

1. **关注点分离**：每层只关注特定职责
2. **可测试性**：各层可独立测试
3. **可替换性**：底层实现可替换
4. **可维护性**：修改影响范围可控
