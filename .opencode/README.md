# OpenCode 记忆系统

OpenCode 记忆系统，让 AI Agent 能够持续学习和进化。

## 功能特性

- **统一记忆**: 所有记忆文件集中在 `memory/` 目录
- **自动学习**: 记录代码模式、常见错误、优化方案
- **Git 集成**: 记忆文件纳入 Git，可追溯历史
- **版本控制**: 记忆文件纳入 Git，可追溯历史

## 目录结构

```
memory/
├── MEMORY.md                 # 长期记忆（架构决策、技术债务）
├── 2026-05-13.md            # 每日工作日志
├── archive/                 # 归档的历史记录
└── patterns/
    ├── component-patterns.md # 组件模式
    └── common-mistakes.md    # 常见错误
```

## 快速开始

启动 OpenCode 后，直接引用记忆：

```
"请先阅读 memory/MEMORY.md 了解项目上下文"
"根据 patterns/component-patterns.md 的规范创建组件"
"参考 common-mistakes.md，避免使用硬编码 CSS"
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

### 更新记忆

任务完成后，OpenCode 会自动总结并更新记忆文件。你也可以手动编辑：

```bash
# 编辑长期记忆
vim memory/MEMORY.md

# 添加新的代码模式
vim memory/patterns/new-pattern.md
```

## 配置

编辑 `.opencode/config.yaml` 自定义行为：

```yaml
behavior:
  auto_summarize: true
  learning:
    enabled: true
    record_patterns: true
```

## 故障排除

### 记忆未更新

```bash
# 检查文件修改时间
ls -la memory/MEMORY.md
```

## 进阶用法

### 自定义模式学习

创建 `memory/patterns/my-patterns.md`：

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

- [ ] 记忆搜索功能
- [ ] 统计报告（最常犯错误、最常用模式）
- [ ] AI 驱动的模式发现
