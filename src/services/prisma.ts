/**
 * Prisma Client 单例封装
 *
 * 提供类型安全的数据库访问，替代 local-api/store/sqlite.ts 的原始 SQL 操作。
 * 当前阶段与现有 local-api 并存，逐步迁移。
 */

import { PrismaClient } from '../generated/prisma'

export const prisma = new PrismaClient()

// ─── 项目状态快照操作（兼容现有 localStorage → 未来迁移）────────

export async function loadProjectState(envId: string = 'default') {
  const record = await prisma.projectState.findUnique({
    where: { envId },
  })

  if (!record) {
    return { projects: [], logs: {} }
  }

  try {
    return JSON.parse(record.snapshotJson) as { projects: unknown[]; logs: Record<string, unknown> }
  } catch {
    return { projects: [], logs: {} }
  }
}

export async function saveProjectState(
  envId: string,
  snapshot: { projects: unknown[]; logs: Record<string, unknown> }
) {
  const snapshotJson = JSON.stringify(snapshot)

  await prisma.projectState.upsert({
    where: { envId },
    create: { envId, snapshotJson },
    update: { snapshotJson },
  })
}

// ─── 审计日志操作 ──────────────────────────────────────────────

export async function appendAuditLog(
  envId: string,
  scene: string,
  detail: string,
  projectCode?: string
) {
  await prisma.auditLog.create({
    data: {
      envId,
      scene,
      detail,
      projectCode: projectCode ?? null,
      at: new Date(),
    },
  })
}

export async function queryAuditLogs(envId: string, projectCode?: string) {
  return prisma.auditLog.findMany({
    where: {
      envId,
      ...(projectCode ? { projectCode } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
}

// ─── 幂等键操作 ────────────────────────────────────────────────

export async function checkIdempotencyKey(key: string, envId: string, scope: string) {
  const record = await prisma.idempotencyKey.findUnique({
    where: { key },
  })

  if (!record) {
    return { exists: false, record: null }
  }

  if (record.envId !== envId || record.scope !== scope) {
    return { exists: false, record: null }
  }

  // 检查是否过期
  if (new Date() > record.expiredAt) {
    return { exists: false, record: null }
  }

  return { exists: true, record }
}

export async function recordIdempotencyKey(
  key: string,
  envId: string,
  scope: string,
  requestHash: string,
  responseStatus: number,
  responseBody?: string,
  ttlDays: number = 7
) {
  const expiredAt = new Date()
  expiredAt.setDate(expiredAt.getDate() + ttlDays)

  await prisma.idempotencyKey.create({
    data: {
      key,
      envId,
      scope,
      requestHash,
      responseStatus,
      responseBody: responseBody ?? null,
      expiredAt,
    },
  })
}

export async function cleanupExpiredIdempotencyKeys() {
  const result = await prisma.idempotencyKey.deleteMany({
    where: {
      expiredAt: {
        lt: new Date(),
      },
    },
  })

  return result.count
}
