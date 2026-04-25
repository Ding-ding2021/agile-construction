-- 本地后端数据库 Schema
-- 支持项目、任务、验收、结算建议、审计日志、幂等记录

-- 项目状态表
CREATE TABLE IF NOT EXISTS project_state (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  env_id TEXT NOT NULL,
  snapshot_json TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(env_id)
);

-- 任务状态表
CREATE TABLE IF NOT EXISTS task_state (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  env_id TEXT NOT NULL,
  context_key TEXT NOT NULL,
  snapshot_json TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(env_id, context_key)
);

-- 验收状态表
CREATE TABLE IF NOT EXISTS acceptance_state (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  env_id TEXT NOT NULL,
  project_code TEXT NOT NULL,
  snapshot_json TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(env_id, project_code)
);

-- 结算建议表
CREATE TABLE IF NOT EXISTS settlement_state (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  env_id TEXT NOT NULL,
  snapshot_json TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(env_id)
);

-- 审计日志表
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  env_id TEXT NOT NULL,
  scene TEXT NOT NULL,
  detail TEXT NOT NULL,
  project_code TEXT,
  at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_env_id ON audit_logs(env_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_project_code ON audit_logs(project_code);
CREATE INDEX IF NOT EXISTS idx_audit_logs_scene ON audit_logs(scene);

-- 幂等记录表
CREATE TABLE IF NOT EXISTS idempotency_keys (
  key TEXT PRIMARY KEY,
  scope TEXT NOT NULL,
  env_id TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  response_status INTEGER NOT NULL,
  response_body TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expired_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_idempotency_keys_env_id ON idempotency_keys(env_id);
CREATE INDEX IF NOT EXISTS idx_idempotency_keys_scope ON idempotency_keys(scope);
CREATE INDEX IF NOT EXISTS idx_idempotency_keys_expired_at ON idempotency_keys(expired_at);
