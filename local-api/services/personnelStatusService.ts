import type { Database as DatabaseType } from 'better-sqlite3'

export interface PersonStatusChange {
  personId: number
  beforeStatus: number
  afterStatus: number
  beforeAvailability: number
  afterAvailability: number
  reason: string | null
  operatorId: string
}

export function changePersonStatus(db: DatabaseType, change: PersonStatusChange): void {
  db.prepare(
    `
    UPDATE pm_person
    SET person_status = ?, availability_status = ?, updated_at = datetime('now')
    WHERE id = ?
  `
  ).run(change.afterStatus, change.afterAvailability, change.personId)

  db.prepare(
    `
    INSERT INTO pm_person_status_log
      (person_id, before_person_status, after_person_status,
       before_availability, after_availability, reason, operator_id, changed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `
  ).run(
    change.personId,
    change.beforeStatus,
    change.afterStatus,
    change.beforeAvailability,
    change.afterAvailability,
    change.reason,
    change.operatorId
  )
}

export function getAvailabilityForStatus(personStatus: number): number {
  switch (personStatus) {
    case 1:
      return 1
    case 2:
    case 3:
    case 4:
      return 3
    default:
      return 3
  }
}

export function canManuallyOverrideAvailability(personStatus: number): boolean {
  return personStatus === 1
}

export function getPersonStatusLogs(
  db: DatabaseType,
  personId: number
): Array<Record<string, unknown>> {
  return db
    .prepare(
      `
      SELECT * FROM pm_person_status_log
      WHERE person_id = ?
      ORDER BY changed_at DESC
    `
    )
    .all(personId)
}
