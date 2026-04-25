-- CreateTable
CREATE TABLE "project_state" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "env_id" TEXT NOT NULL,
    "snapshot_json" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "task_state" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "env_id" TEXT NOT NULL,
    "context_key" TEXT NOT NULL,
    "snapshot_json" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "acceptance_state" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "env_id" TEXT NOT NULL,
    "project_code" TEXT NOT NULL,
    "snapshot_json" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "settlement_state" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "env_id" TEXT NOT NULL,
    "snapshot_json" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "env_id" TEXT NOT NULL,
    "scene" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "project_code" TEXT,
    "at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "idempotency_keys" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "scope" TEXT NOT NULL,
    "env_id" TEXT NOT NULL,
    "request_hash" TEXT NOT NULL,
    "response_status" INTEGER NOT NULL,
    "response_body" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expired_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "projects" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "budget" TEXT,
    "team_size" TEXT,
    "date_range" TEXT,
    "description" TEXT,
    "owner" TEXT,
    "risk_level" TEXT,
    "milestone" TEXT,
    "tasks" TEXT,
    "template_id" TEXT,
    "dispatch_status" TEXT,
    "execution_status" TEXT,
    "acceptance_status" TEXT,
    "settlement_status" TEXT,
    "pending_dispatch_count" INTEGER NOT NULL DEFAULT 0,
    "pending_execution_count" INTEGER NOT NULL DEFAULT 0,
    "pending_acceptance_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "project_phases" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "project_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" TEXT NOT NULL,
    "end_date" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    CONSTRAINT "project_phases_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "project_milestones" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "project_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "due_date" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "assignee" TEXT,
    "completed_date" TEXT,
    CONSTRAINT "project_milestones_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "project_tasks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "project_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "assignee" TEXT,
    "start_date" TEXT,
    "end_date" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "parent_id" INTEGER,
    CONSTRAINT "project_tasks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "project_risks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "project_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "probability" TEXT,
    "impact" TEXT,
    "mitigation" TEXT,
    "status" TEXT NOT NULL,
    CONSTRAINT "project_risks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "project_members" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "project_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "avatar" TEXT,
    CONSTRAINT "project_members_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "project_status_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "project_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "at" DATETIME NOT NULL,
    "operator" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "from_status" TEXT,
    "to_status" TEXT,
    "reason" TEXT,
    CONSTRAINT "project_status_logs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "project_state_env_id_key" ON "project_state"("env_id");

-- CreateIndex
CREATE UNIQUE INDEX "task_state_env_id_context_key_key" ON "task_state"("env_id", "context_key");

-- CreateIndex
CREATE UNIQUE INDEX "acceptance_state_env_id_project_code_key" ON "acceptance_state"("env_id", "project_code");

-- CreateIndex
CREATE UNIQUE INDEX "settlement_state_env_id_key" ON "settlement_state"("env_id");

-- CreateIndex
CREATE INDEX "audit_logs_env_id_idx" ON "audit_logs"("env_id");

-- CreateIndex
CREATE INDEX "audit_logs_project_code_idx" ON "audit_logs"("project_code");

-- CreateIndex
CREATE INDEX "audit_logs_scene_idx" ON "audit_logs"("scene");

-- CreateIndex
CREATE INDEX "idempotency_keys_env_id_idx" ON "idempotency_keys"("env_id");

-- CreateIndex
CREATE INDEX "idempotency_keys_scope_idx" ON "idempotency_keys"("scope");

-- CreateIndex
CREATE INDEX "idempotency_keys_expired_at_idx" ON "idempotency_keys"("expired_at");

-- CreateIndex
CREATE UNIQUE INDEX "projects_code_key" ON "projects"("code");
