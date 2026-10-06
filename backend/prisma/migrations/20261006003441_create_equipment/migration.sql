-- CreateTable
CREATE TABLE "Equipment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "patrimony" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "acquisitionDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_id_key" ON "Equipment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_patrimony_key" ON "Equipment"("patrimony");
