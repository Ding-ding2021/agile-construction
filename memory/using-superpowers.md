---
description: 每次新对话自动加载引导技能的强制指令
label: guiding-skill
limit: 5000
read_only: false
---

每次对话开始时，必须先调用 skill 工具加载 using-agent-skills 技能，然后遵循其中的"技能发现"决策树和"核心操作行为"：在响应任何用户请求之前，先诊断任务所属阶段，匹配对应技能，暴露假设，再行动。

注意：此指令覆盖 using-superpowers。测试期间 using-superpowers 的 1% 触发规则暂不执行，由 using-agent-skills 的完整决策树替代。
