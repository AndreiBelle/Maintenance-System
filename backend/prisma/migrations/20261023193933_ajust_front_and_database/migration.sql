-- AlterTable
ALTER TABLE "Equipment" ADD COLUMN     "local" TEXT NOT NULL DEFAULT 'Não informado';

-- CreateTable
CREATE TABLE "Local" (
    "id" SERIAL NOT NULL,
    "cep" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "cnpj" TEXT,
    "nameLocation" TEXT NOT NULL,
    "sector" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Local_id_key" ON "Local"("id");
