# OpenCode 记忆系统 - 快速参考

## 启动时使用记忆

每次启动 OpenCode 会话时，引用记忆：

```
请先阅读以下记忆文件了解项目上下文：
1. memory/MEMORY.md - 项目架构和关键决策
2. memory/2026-04-27.md - 今日工作记录
3. memory/patterns/common-mistakes.md - 避免常见错误
```

## 更新记忆的时机

1. **完成重要任务后**: 更新 MEMORY.md 记录架构决策
2. **解决 bug 后**: 添加到 common-mistakes.md
3. **发现新模式**: 创建 patterns/\*.md 文件
4. **每日结束时**: OpenCode 自动总结到 YYYY-MM-DD.md

## 记忆文件说明

| 文件           | 用途                         | 更新频率   |
| -------------- | ---------------------------- | ---------- |
| MEMORY.md      | 长期记忆（架构、债务、决策） | 重要变更时 |
| YYYY-MM-DD.md  | 每日工作日志                 | 每天       |
| patterns/\*.md | 代码模式学习                 | 发现新模式 |

## 提示词模板

### 开始新任务

```
基于 memory/MEMORY.md 中的项目上下文，帮我实现 [功能]。
请遵循 patterns/component-patterns.md 的组件规范，
并参考 common-mistakes.md 避免已知问题。
```

### 询问项目状态

```
根据 memory/ 中的记录，总结一下：
1. 当前技术债务有哪些？
2. 代码质量红线是什么？
3. 最近完成了哪些重要任务？
```

### 修复 bug 后

```
我遇到了 [问题]，解决方法是 [方案]。
请更新 memory/patterns/common-mistakes.md，
记录这个错误和解决方案，避免以后重复犯错。
```

## 故障排除

**问题**: 记忆没有同步
**解决**: 所有记忆已统一在 `memory/` 目录下，无需同步。
