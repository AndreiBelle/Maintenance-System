-- Rename the existing technician position field and add its contact details.
ALTER TABLE "Technicians" RENAME COLUMN "position" TO "specialty";
ALTER TABLE "Technicians"
    ADD COLUMN "phone" TEXT NOT NULL DEFAULT '',
    ADD COLUMN "email" TEXT NOT NULL DEFAULT '';

-- Add category and preventive maintenance data without changing existing equipment.
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "preventivePeriodicity" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE UNIQUE INDEX "Category_id_key" ON "Category"("id");

ALTER TABLE "Equipment"
    ADD COLUMN "nextPreventiveDate" TIMESTAMP(3),
    ADD COLUMN "categoryId" INTEGER;
ALTER TABLE "Equipment"
    ADD CONSTRAINT "Equipment_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "Category"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "WorkOrder" (
    "id" SERIAL NOT NULL,
    "equipmentId" INTEGER NOT NULL,
    "technicianId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "expectedDeliveryDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE UNIQUE INDEX "WorkOrder_id_key" ON "WorkOrder"("id");
ALTER TABLE "WorkOrder"
    ADD CONSTRAINT "WorkOrder_equipmentId_fkey"
    FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "WorkOrder"
    ADD CONSTRAINT "WorkOrder_technicianId_fkey"
    FOREIGN KEY ("technicianId") REFERENCES "Technicians"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
