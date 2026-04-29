import { initDatabase, getDatabase, closeDatabase } from './store/sqlite'

initDatabase()
const db = getDatabase()
const now = new Date().toISOString()

// ─── 项目模板 ──────────────────────────────────────────────────

const projectInsert = db.prepare(`
  INSERT OR REPLACE INTO project_templates (
    template_id, template_code, template_name, template_version,
    status, priority, scopes, phaseBlueprint, milestoneBlueprint,
    taskTemplateBinding, meta, updated_at
  ) VALUES (
    @a, @b, @c, @d, @e, @f, @g, @h, @i, @j, @k, @l
  )
`)

projectInsert.run({
  a: 'project-template-001',
  b: 'PT-STORE-STANDARD',
  c: '标准门店开店项目',
  d: '1.0.0',
  e: 'active',
  f: 1,
  g: JSON.stringify({ brandScope: ['标准品牌'], storeTypeScope: ['标准店'] }),
  h: JSON.stringify([
    {
      phaseId: 'p01',
      phaseCode: 'P01',
      phaseName: '选址',
      phaseOrder: 1,
      ownerRole: '开发经理',
      entryGuards: [],
      exitGuards: ['选址完成'],
    },
    {
      phaseId: 'p02',
      phaseCode: 'P02',
      phaseName: '合同',
      phaseOrder: 2,
      ownerRole: '商务经理',
      entryGuards: ['选址完成'],
      exitGuards: ['合同签订'],
    },
    {
      phaseId: 'p03',
      phaseCode: 'P03',
      phaseName: '设计',
      phaseOrder: 3,
      ownerRole: '设计经理',
      entryGuards: ['合同签订'],
      exitGuards: ['图纸完成'],
    },
    {
      phaseId: 'p04',
      phaseCode: 'P04',
      phaseName: '施工',
      phaseOrder: 4,
      ownerRole: '项目经理',
      entryGuards: ['图纸完成'],
      exitGuards: ['施工完成'],
    },
    {
      phaseId: 'p05',
      phaseCode: 'P05',
      phaseName: '验收',
      phaseOrder: 5,
      ownerRole: '品控经理',
      entryGuards: ['施工完成'],
      exitGuards: ['验收通过'],
    },
  ]),
  i: JSON.stringify([
    {
      milestoneId: 'ms01',
      milestoneName: '合同签订',
      milestoneType: '签约',
      linkedTemplateCodes: ['TT-CONTRACT'],
      plannedOffsetDays: 14,
      isKey: true,
      completionRule: '合同已盖章',
    },
    {
      milestoneId: 'ms02',
      milestoneName: '图纸确认',
      milestoneType: '设计',
      linkedTemplateCodes: ['TT-DESIGN'],
      plannedOffsetDays: 30,
      isKey: true,
      completionRule: '图纸已会签',
    },
    {
      milestoneId: 'ms03',
      milestoneName: '竣工验收',
      milestoneType: '验收',
      linkedTemplateCodes: ['TT-INSPECT'],
      plannedOffsetDays: 60,
      isKey: true,
      completionRule: '验收单已签署',
    },
  ]),
  j: JSON.stringify([
    { templateCode: 'TT-CONTRACT', phaseCode: 'P02', sortOrder: 1, requiredFlag: true },
    { templateCode: 'TT-DESIGN', phaseCode: 'P03', sortOrder: 1, requiredFlag: true },
    { templateCode: 'TT-CONSTRUCTION', phaseCode: 'P04', sortOrder: 1, requiredFlag: true },
    { templateCode: 'TT-INSPECT', phaseCode: 'P05', sortOrder: 1, requiredFlag: true },
  ]),
  k: JSON.stringify({ createdBy: '系统' }),
  l: now,
})
console.log('[Seed] 项目模板: 1 条')

// ─── 任务模板 ──────────────────────────────────────────────────

const taskInsert = db.prepare(`
  INSERT OR REPLACE INTO task_templates (
    task_template_id, task_template_code, task_template_name, task_template_version,
    status, template_level, business_domain, task_type,
    required_flag, milestone_flag, owner_role, assignee_type_default,
    sla_rule_id, standardBinding, dependencyBlueprint,
    childTemplateRefs, parent_template_code, sort_order, meta, updated_at
  ) VALUES (
    @a, @b, @c, @d, @e, @f, @g, @h, @i, @j, @k, @l, @m, @n, @o, @p, @q, @r, @s, @t
  )
`)

const tasks = [
  {
    a: 'task-template-001',
    b: 'TT-CONTRACT',
    c: '合同签订',
    d: '1.0.0',
    e: 'active',
    f: 'task',
    g: '商务',
    h: '关键任务',
    i: 1,
    j: 1,
    k: '商务经理',
    l: '商务经理',
    m: null,
    n: null,
    o: null,
    p: null,
    q: null,
    r: 1,
    s: '{}',
    t: now,
  },
  {
    a: 'task-template-002',
    b: 'TT-DESIGN',
    c: '设计出图',
    d: '1.0.0',
    e: 'active',
    f: 'work_package',
    g: '设计',
    h: '标准任务',
    i: 1,
    j: 0,
    k: '设计经理',
    l: '设计师',
    m: null,
    n: null,
    o: null,
    p: null,
    q: null,
    r: 2,
    s: '{}',
    t: now,
  },
  {
    a: 'task-template-003',
    b: 'TT-CONSTRUCTION',
    c: '施工管理',
    d: '1.0.0',
    e: 'active',
    f: 'work_package',
    g: '工程',
    h: '标准任务',
    i: 1,
    j: 0,
    k: '项目经理',
    l: '施工员',
    m: null,
    n: null,
    o: null,
    p: null,
    q: null,
    r: 3,
    s: '{}',
    t: now,
  },
  {
    a: 'task-template-004',
    b: 'TT-INSPECT',
    c: '验收检查',
    d: '1.0.0',
    e: 'active',
    f: 'task',
    g: '品控',
    h: '标准任务',
    i: 1,
    j: 1,
    k: '品控经理',
    l: '品控员',
    m: null,
    n: null,
    o: null,
    p: null,
    q: null,
    r: 4,
    s: '{}',
    t: now,
  },
]

for (const t of tasks) {
  taskInsert.run(t)
}
console.log(`[Seed] 任务模板: ${tasks.length} 条`)

closeDatabase()
console.log('[Seed] 完成')
