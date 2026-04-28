/*
  Warnings:

  - You are about to drop the `acceptance_state` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project_state` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `settlement_state` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `task_state` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `title` on the `project_risks` table. All the data in the column will be lost.
  - You are about to drop the column `assignee` on the `project_tasks` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `project_tasks` table. All the data in the column will be lost.
  - Added the required column `description` to the `project_risks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `project_tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `project_tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brand` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planned_open_date` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_tone` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "acceptance_state_env_id_project_code_key";

-- DropIndex
DROP INDEX "project_state_env_id_key";

-- DropIndex
DROP INDEX "settlement_state_env_id_key";

-- DropIndex
DROP INDEX "task_state_env_id_context_key_key";

-- AlterTable
ALTER TABLE "project_members" ADD COLUMN "department" TEXT;
ALTER TABLE "project_members" ADD COLUMN "email" TEXT;
ALTER TABLE "project_members" ADD COLUMN "phone" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "acceptance_state";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "project_state";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "settlement_state";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "task_state";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "task_relations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "from_task_id" INTEGER NOT NULL,
    "to_task_id" INTEGER NOT NULL,
    "relation_type" TEXT NOT NULL,
    CONSTRAINT "task_relations_from_task_id_fkey" FOREIGN KEY ("from_task_id") REFERENCES "project_tasks" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "task_relations_to_task_id_fkey" FOREIGN KEY ("to_task_id") REFERENCES "project_tasks" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_project_risks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "project_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "probability" TEXT,
    "impact" TEXT,
    "mitigation" TEXT,
    "status" TEXT NOT NULL,
    "assignee" TEXT,
    "due_date" TEXT,
    CONSTRAINT "project_risks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_project_risks" ("id", "impact", "level", "mitigation", "probability", "project_id", "status") SELECT "id", "impact", "level", "mitigation", "probability", "project_id", "status" FROM "project_risks";
DROP TABLE "project_risks";
ALTER TABLE "new_project_risks" RENAME TO "project_risks";
CREATE TABLE "new_project_tasks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "project_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
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
    "created_by" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "project_tasks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "project_tasks_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "project_tasks" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_project_tasks" ("code", "id", "name", "parent_id", "progress", "project_id", "start_date", "status") SELECT "code", "id", "name", "parent_id", "progress", "project_id", "start_date", "status" FROM "project_tasks";
DROP TABLE "project_tasks";
ALTER TABLE "new_project_tasks" RENAME TO "project_tasks";
CREATE UNIQUE INDEX "project_tasks_code_key" ON "project_tasks"("code");
CREATE TABLE "new_projects" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "status_tone" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "budget" TEXT,
    "team_size" TEXT,
    "date_range" TEXT,
    "description" TEXT,
    "owner" TEXT,
    "risk_level" TEXT,
    "risk_count" INTEGER NOT NULL DEFAULT 0,
    "milestone" TEXT,
    "tasks" TEXT,
    "template_id" TEXT,
    "planned_open_date" TEXT NOT NULL,
    "actual_open_date" TEXT,
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
INSERT INTO "new_projects" ("acceptance_status", "budget", "code", "created_at", "date_range", "description", "dispatch_status", "execution_status", "id", "milestone", "name", "owner", "pending_acceptance_count", "pending_dispatch_count", "pending_execution_count", "progress", "risk_level", "settlement_status", "stage", "status", "tasks", "team_size", "template_id", "updated_at") SELECT "acceptance_status", "budget", "code", "created_at", "date_range", "description", "dispatch_status", "execution_status", "id", "milestone", "name", "owner", "pending_acceptance_count", "pending_dispatch_count", "pending_execution_count", "progress", "risk_level", "settlement_status", "stage", "status", "tasks", "team_size", "template_id", "updated_at" FROM "projects";
DROP TABLE "projects";
ALTER TABLE "new_projects" RENAME TO "projects";
CREATE UNIQUE INDEX "projects_code_key" ON "projects"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "task_relations_from_task_id_to_task_id_relation_type_key" ON "task_relations"("from_task_id", "to_task_id", "relation_type");
