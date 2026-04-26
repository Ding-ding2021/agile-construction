import { tool } from '@opencode-ai/plugin'
import fs from 'node:fs'
import path from 'node:path'

const MEMORY_DIR = '.workbuddy/memory'

function getDateStr() {
  return new Date().toISOString().slice(0, 10)
}

function getTimeStr() {
  return new Date().toISOString().slice(11, 19)
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function appendToFile(filePath: string, content: string) {
  ensureDir(path.dirname(filePath))
  if (fs.existsSync(filePath)) {
    fs.appendFileSync(filePath, content)
  } else {
    fs.writeFileSync(filePath, content)
  }
}

function formatDailyEntry(task: string, detail: string, category: string): string {
  const time = getTimeStr()
  const header = `## ${task}`
  const meta = `- **时间**: ${time}`
  let badge = ''
  if (category === 'fix') badge = ' 🐛'
  else if (category === 'refactor') badge = ' 🔧'
  else if (category === 'feat') badge = ' ✨'
  else if (category === 'docs') badge = ' 📝'

  return ['', `${header}${badge}`, meta, '', detail, '', '---', ''].join('\n')
}

function formatMemoryUpdate(decision: string, techDebt: string): string {
  const parts: string[] = []
  if (decision) {
    parts.push(`- ${decision}`)
  }
  if (techDebt) {
    parts.push(`- ${techDebt}`)
  }
  if (parts.length === 0) return ''
  return `\n## ${getDateStr()} 更新\n\n${parts.join('\n')}\n`
}

export default tool({
  description:
    '完成任务后调用，写入每日工作日志到 .workbuddy/memory/YYYY-MM-DD.md；如有架构决策或技术债务变化则同时更新 MEMORY.md',

  args: {
    task: tool.schema.string().describe("任务简述，如'修复设施管理页面布局'"),
    detail: tool.schema
      .string()
      .optional()
      .describe('任务详情，支持 Markdown，如修改的文件列表、验证结果等'),
    category: tool.schema.enum(['fix', 'refactor', 'feat', 'docs']).optional().describe('任务分类'),
    decision: tool.schema.string().optional().describe('如有架构决策(ADR级)，描述决策内容和原因'),
    techDebt: tool.schema.string().optional().describe('如有技术债务变化（新增/解决），描述具体项'),
  },

  async execute(args, context) {
    const root = context.worktree || context.directory
    const memoryRoot = path.join(root, MEMORY_DIR)
    const dateStr = getDateStr()

    // 1. 写入每日日志
    const dailyLogPath = path.join(memoryRoot, `${dateStr}.md`)
    const category = args.category || 'feat'
    const detail = args.detail || args.task
    const dailyEntry = formatDailyEntry(args.task, detail, category)
    appendToFile(dailyLogPath, dailyEntry)

    // 2. 如有决策/技术债务变化，更新长期记忆
    let memoryUpdated = false
    if (args.decision || args.techDebt) {
      const memoryPath = path.join(memoryRoot, 'MEMORY.md')
      const memoryEntry = formatMemoryUpdate(args.decision || '', args.techDebt || '')
      if (memoryEntry) {
        appendToFile(memoryPath, memoryEntry)
        memoryUpdated = true
      }
    }

    const result = [`✅ 每日日志已写入: ${dailyLogPath}`]
    if (memoryUpdated) {
      result.push(`✅ 长期记忆已更新: ${memoryRoot}/MEMORY.md`)
    }
    return result.join('\n')
  },
})
