-- CreateTable
CREATE TABLE "work_packages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "project_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT '规划中',
    "manager_id" TEXT,
    "stage_id" TEXT,
    "description" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "planned_start_at" TEXT,
    "planned_end_at" TEXT,
    "actual_start_at" TEXT,
    "actual_end_at" TEXT,
    "planned_work_hours" INTEGER,
    "actual_work_hours" INTEGER,
    "budget" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "work_packages_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "task_event_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "task_id" INTEGER NOT NULL,
    "event_type" TEXT NOT NULL,
    "event_action" TEXT NOT NULL,
    "before_value" TEXT,
    "after_value" TEXT,
    "operator_id" TEXT NOT NULL,
    "operator_source" TEXT NOT NULL DEFAULT 'user',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "task_event_logs_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "project_tasks" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "task_submissions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "task_id" INTEGER NOT NULL,
    "submission_type" TEXT NOT NULL DEFAULT 'normal',
    "description" TEXT,
    "attachment_ids" TEXT,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "submitted_by" TEXT NOT NULL,
    "submitted_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_by" TEXT,
    "review_result" TEXT,
    "review_comment" TEXT,
    "reviewed_at" DATETIME,
    CONSTRAINT "task_submissions_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "project_tasks" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_project_tasks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "project_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT '草稿',
    "assignee_id" TEXT,
    "assignee_name" TEXT,
    "start_date" TEXT,
    "due_date" TEXT,
    "parent_id" INTEGER,
    "node_level_type" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "task_type" TEXT,
    "source_type" TEXT,
    "risk_level" TEXT,
    "sla_status" TEXT,
    "description" TEXT,
    "required_flag" BOOLEAN NOT NULL DEFAULT true,
    "milestone_flag" BOOLEAN NOT NULL DEFAULT false,
    "owner_role" TEXT,
    "assignee_type" TEXT,
    "brand_id" TEXT,
    "store_id" TEXT,
    "actual_start_date" TEXT,
    "actual_end_date" TEXT,
    "blocked_reason" TEXT,
    "remind_count" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT,
    "work_package_id" TEXT,
    "sla_rule_id" TEXT,
    "planned_work_hours" INTEGER,
    "actual_work_hours" INTEGER,
    "standard_snapshot_id" TEXT,
    "standard_binding_status" TEXT NOT NULL DEFAULT 'unbound',
    "snapshot_status" TEXT NOT NULL DEFAULT 'draft',
    "derived_from_task_id" INTEGER,
    "is_rectification" BOOLEAN NOT NULL DEFAULT false,
    "rectification_reason" TEXT,
    "close_reason" TEXT,
    "reopen_count" INTEGER NOT NULL DEFAULT 0,
    "created_by" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "project_tasks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "project_tasks_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "project_tasks" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "project_tasks_derived_from_task_id_fkey" FOREIGN KEY ("derived_from_task_id") REFERENCES "project_tasks" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "project_tasks_work_package_id_fkey" FOREIGN KEY ("work_package_id") REFERENCES "work_packages" ("code") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_project_tasks" ("actual_end_date", "actual_start_date", "actual_work_hours", "assignee_id", "assignee_name", "blocked_reason", "code", "created_at", "created_by", "description", "due_date", "id", "name", "node_level_type", "parent_id", "planned_work_hours", "priority", "progress", "project_id", "remind_count", "risk_level", "sla_rule_id", "sla_status", "source_type", "standard_snapshot_id", "start_date", "status", "tags", "task_type", "updated_at", "updated_by", "work_package_id") SELECT "actual_end_date", "actual_start_date", "actual_work_hours", "assignee_id", "assignee_name", "blocked_reason", "code", "created_at", "created_by", "description", "due_date", "id", "name", "node_level_type", "parent_id", "planned_work_hours", "priority", "progress", "project_id", "remind_count", "risk_level", "sla_rule_id", "sla_status", "source_type", "standard_snapshot_id", "start_date", "status", "tags", "task_type", "updated_at", "updated_by", "work_package_id" FROM "project_tasks";
DROP TABLE "project_tasks";
ALTER TABLE "new_project_tasks" RENAME TO "project_tasks";
CREATE UNIQUE INDEX "project_tasks_code_key" ON "project_tasks"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "work_packages_code_key" ON "work_packages"("code");

-- CreateIndex
CREATE INDEX "task_event_logs_task_id_idx" ON "task_event_logs"("task_id");

-- CreateIndex
CREATE INDEX "task_event_logs_event_type_idx" ON "task_event_logs"("event_type");

-- CreateIndex
CREATE INDEX "task_submissions_task_id_idx" ON "task_submissions"("task_id");

-- CreateIndex
CREATE INDEX "task_submissions_status_idx" ON "task_submissions"("status");
