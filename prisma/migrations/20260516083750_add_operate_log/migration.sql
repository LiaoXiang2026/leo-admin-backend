-- CreateTable
CREATE TABLE "operate_logs" (
    "id" SERIAL NOT NULL,
    "operator" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT,
    "method" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "params" TEXT,
    "duration" INTEGER,
    "ip" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "operate_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "operate_logs_module_idx" ON "operate_logs"("module");

-- CreateIndex
CREATE INDEX "operate_logs_action_idx" ON "operate_logs"("action");

-- CreateIndex
CREATE INDEX "operate_logs_operator_idx" ON "operate_logs"("operator");

-- CreateIndex
CREATE INDEX "operate_logs_created_at_idx" ON "operate_logs"("created_at");
