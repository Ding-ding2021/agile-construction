-- CreateTable
CREATE TABLE "project_templates" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "template_id" TEXT NOT NULL,
    "template_code" TEXT NOT NULL,
    "template_name" TEXT NOT NULL,
    "template_version" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "scopes" TEXT,
    "phaseBlueprint" TEXT,
    "milestoneBlueprint" TEXT,
    "taskTemplateBinding" TEXT,
    "meta" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "task_templates" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "task_template_id" TEXT NOT NULL,
    "task_template_code" TEXT NOT NULL,
    "task_template_name" TEXT NOT NULL,
    "task_template_version" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "template_level" TEXT NOT NULL,
    "business_domain" TEXT NOT NULL,
    "task_type" TEXT NOT NULL,
    "required_flag" BOOLEAN NOT NULL DEFAULT false,
    "milestone_flag" BOOLEAN NOT NULL DEFAULT false,
    "owner_role" TEXT NOT NULL,
    "assignee_type_default" TEXT NOT NULL,
    "sla_rule_id" TEXT,
    "standardBinding" TEXT,
    "dependencyBlueprint" TEXT,
    "childTemplateRefs" TEXT,
    "parent_template_code" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "meta" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "current_task_count" INTEGER NOT NULL DEFAULT 0,
    "availability_status" TEXT NOT NULL,
    "qualification_status" TEXT NOT NULL,
    "serviceAreas" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "product_categories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parent_id" INTEGER,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "supplierIds" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "product_categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "product_categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "template_instantiations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "project_id" INTEGER NOT NULL,
    "template_id" TEXT NOT NULL,
    "template_version" TEXT NOT NULL,
    "matchInput" TEXT,
    "outputSnapshot" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "project_templates_template_id_key" ON "project_templates"("template_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_templates_template_code_key" ON "project_templates"("template_code");

-- CreateIndex
CREATE UNIQUE INDEX "task_templates_task_template_id_key" ON "task_templates"("task_template_id");

-- CreateIndex
CREATE UNIQUE INDEX "task_templates_task_template_code_key" ON "task_templates"("task_template_code");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_code_key" ON "suppliers"("code");

-- CreateIndex
CREATE UNIQUE INDEX "product_categories_code_key" ON "product_categories"("code");
