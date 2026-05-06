/**
 * Re-export from domain layer.
 * 守卫逻辑已迁移到 src/domain/taskStatusMachine.ts
 * 此文件保留用于旧 import 路径兼容，后续逐步迁移。
 */
export {
  validateStatusTransition,
  validateBatchStatusTransition,
  getAvailableNextStatuses,
} from '../../domain/taskStatusMachine'

export type { GuardValidationResult } from '../../domain/taskStatusMachine'
