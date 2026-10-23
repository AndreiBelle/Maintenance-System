-- CreateTable
CREATE TABLE "Technicians" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "position" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Technicians_id_key" ON "Technicians"("id");
