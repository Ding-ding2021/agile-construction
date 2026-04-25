import { createIdempotencyKey, serverAdapter } from '../api/serverAdapter'
import { StructuredError, errorLogger } from '../errors/StructuredError'

export type AuditScene = 'project' | 'task' | 'acceptance' | 'settlement' | 'system'

export const auditRepository = {
  async append(scene: AuditScene, detail: string, projectCode?: string): Promise<void> {
    try {
      await serverAdapter.appendAuditLog(
        {
          scene,
          detail,
          projectCode,
        },
        createIdempotencyKey('audit', scene)
      )
    } catch (err) {
      // 增强日志：记录审计日志写入失败（不阻塞主流程）
      const error = StructuredError.fromRaw(
        err,
        'NETWORK_ERROR',
        'repository',
        'append-audit-log',
        {
          raw: err,
        }
      )
      errorLogger.log(error)
    }
  },
}
