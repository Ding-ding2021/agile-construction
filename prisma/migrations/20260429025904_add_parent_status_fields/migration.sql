-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_projects" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "parent_status" TEXT NOT NULL DEFAULT '启动',
    "sub_status_json" TEXT,
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
INSERT INTO "new_projects" ("acceptance_status", "actual_open_date", "brand", "budget", "code", "created_at", "date_range", "description", "dispatch_status", "execution_status", "id", "milestone", "name", "owner", "pending_acceptance_count", "pending_dispatch_count", "pending_execution_count", "planned_open_date", "progress", "risk_count", "risk_level", "settlement_status", "stage", "status", "status_tone", "tasks", "team_size", "template_id", "updated_at") SELECT "acceptance_status", "actual_open_date", "brand", "budget", "code", "created_at", "date_range", "description", "dispatch_status", "execution_status", "id", "milestone", "name", "owner", "pending_acceptance_count", "pending_dispatch_count", "pending_execution_count", "planned_open_date", "progress", "risk_count", "risk_level", "settlement_status", "stage", "status", "status_tone", "tasks", "team_size", "template_id", "updated_at" FROM "projects";
DROP TABLE "projects";
ALTER TABLE "new_projects" RENAME TO "projects";
CREATE UNIQUE INDEX "projects_code_key" ON "projects"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
