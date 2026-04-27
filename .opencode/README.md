# OpenCode 记忆系统

OpenCode ↔ Workbuddy 双向记忆同步系统，让 AI Agent 能够持续学习和进化。

## 功能特性

- **双向同步**: Workbuddy 和 OpenCode 记忆实时同步
- **自动学习**: 记录代码模式、常见错误、优化方案
- **Git 集成**: 提交前自动同步，确保记忆一致性
- **版本控制**: 记忆文件纳入 Git，可追溯历史

## 目录结构

```
.opencode/
├── memory/
│   ├── MEMORY.md                 # 长期记忆（架构决策、技术债务）
│   ├── 2026-04-27.md            # 每日工作日志
│   └── patterns/
│       ├── component-patterns.md # 组件模式
│       └── common-mistakes.md    # 常见错误
├── scripts/
│   └── sync-memory.sh           # 同步脚本
├── hooks/
│   ├── pre-commit               # 提交前同步
│   └── post-commit              # 提交后处理
├── config.yaml                  # 配置文件
└── install.sh                   # 安装脚本
```

## 快速开始

### 1. 安装

```bash
./.opencode/install.sh
```

### 2. 手动同步

```bash
# 双向同步
./.opencode/scripts/sync-memory.sh

# 仅同步到 OpenCode
./.opencode/scripts/sync-memory.sh to-opencode

# 仅同步到 Workbuddy
./.opencode/scripts/sync-memory.sh to-workbuddy
```

## 记忆类型

### 1. 长期记忆 (MEMORY.md)

记录项目级的重要决策：

- 架构决策
- 技术债务
- 用户工作风格
- 关键文档索引

### 2. 每日日志 (YYYY-MM-DD.md)

记录每日工作内容：

- 完成的任务
- 遇到的问题
- 解决方案
- 性能数据

### 3. 代码模式 (patterns/)

AI 学习的成功模式：

- 组件结构
- CSS 规范
- API 调用
- 文件组织

### 4. 常见错误 (common-mistakes.md)

避免重复犯错：

- 错误示例
- 正确做法
- 经验教训

## 使用提示

### 在对话中使用记忆

启动 OpenCode 后，可以这样引用记忆：

```
"请先阅读 .opencode/memory/MEMORY.md 了解项目上下文"

"根据 patterns/component-patterns.md 的规范创建组件"

"参考 common-mistakes.md，避免使用硬编码 CSS"
```

### 更新记忆

任务完成后，OpenCode 会自动总结并更新记忆文件。你也可以手动编辑：

```bash
# 编辑长期记忆
vim .opencode/memory/MEMORY.md

# 添加新的代码模式
vim .opencode/memory/patterns/new-pattern.md
```

## 同步机制

### 自动同步时机

1. **Git 提交前**: 自动执行双向同步
2. **启动时**: 读取最新记忆
3. **任务完成**: 自动更新记忆

### 冲突解决

如果双方都有更新，系统会根据**修改时间**自动选择最新版本。

## 配置

编辑 `.opencode/config.yaml` 自定义行为：

```yaml
memory:
  sync:
    enabled: true
    auto_sync_on_start: true
    auto_sync_on_complete: true

behavior:
  auto_summarize: true
  learning:
    enabled: true
    record_patterns: true
```

## 与 Workbuddy 共存

- Workbuddy 继续管理 `.workbuddy/memory/`
- OpenCode 自动同步到 `.opencode/memory/`
- 双方修改 MEMORY.md 都会自动同步
- 每日日志单向从 Workbuddy 复制到 OpenCode

## 故障排除

### 同步失败

```bash
# 检查权限
chmod +x .opencode/scripts/sync-memory.sh

# 手动执行查看错误
bash -x .opencode/scripts/sync-memory.sh
```

### 记忆未更新

```bash
# 检查文件修改时间
touch .workbuddy/memory/MEMORY.md
./.opencode/scripts/sync-memory.sh
```

## 进阶用法

### 自定义模式学习

创建 `.opencode/memory/patterns/my-patterns.md`：

```markdown
# 我的自定义模式

## API 调用模式

...

## 状态管理模式

...
```

### 团队共享记忆

记忆文件已纳入 Git，团队成员可以：

1. 共享项目知识
2. 继承代码规范
3. 避免重复踩坑

## 未来扩展

- [ ] 智能合并（基于内容而非时间）
- [ ] 记忆搜索功能
- [ ] 统计报告（最常犯错误、最常用模式）
- [ ] AI 驱动的模式发现
