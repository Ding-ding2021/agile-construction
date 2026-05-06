import { initDatabase, getDatabase, closeDatabase } from './store/sqlite'

initDatabase()
const db = getDatabase()
const now = new Date().toISOString()

db.prepare(`DELETE FROM pm_person`).run()
db.prepare(`DELETE FROM pm_organization`).run()

db.prepare(`
  INSERT INTO pm_organization (org_code, org_name, org_type, status, contact_name, contact_mobile, created_at, updated_at)
  VALUES ('ORG-001', '品牌方A', 1, 1, '张三', '13800000001', @now, @now)
`).run({ now })
db.prepare(`
  INSERT INTO pm_organization (org_code, org_name, org_type, status, contact_name, contact_mobile, created_at, updated_at)
  VALUES ('ORG-002', '平台运营', 2, 1, '李四', '13800000002', @now, @now)
`).run({ now })
db.prepare(`
  INSERT INTO pm_organization (org_code, org_name, org_type, status, contact_name, contact_mobile, created_at, updated_at)
  VALUES ('ORG-003', '建设方X', 3, 1, '王五', '13800000003', @now, @now)
`).run({ now })

const names = [
  { name: '赵六', mobile: '13900000001', orgId: 1, title: '项目经理' },
  { name: '钱七', mobile: '13900000002', orgId: 1, title: '采购专员' },
  { name: '孙八', mobile: '13900000003', orgId: 2, title: '运营经理' },
  { name: '周九', mobile: '13900000004', orgId: 3, title: '施工队长' },
  { name: '吴十', mobile: '13900000005', orgId: 3, title: '质检员' },
]

names.forEach((n, i) => {
  const code = `P-${String(i + 1).padStart(4, '0')}`
  db.prepare(`
    INSERT INTO pm_person (person_code, name, mobile, org_id, title, employment_type,
      person_status, availability_status, work_city, created_by, created_at, updated_at)
    VALUES (@code, @name, @mobile, @orgId, @title, @employmentType, @pStatus, @aStatus, @city, @by, @now, @now)
  `).run({
    code,
    name: n.name,
    mobile: n.mobile,
    orgId: n.orgId,
    title: n.title,
    employmentType: 1,
    pStatus: i === 4 ? 2 : 1,
    aStatus: i === 4 ? 3 : 1,
    city: '北京',
    by: 'seed',
    now,
  })
})

console.log('人员种子数据已插入')
closeDatabase()
