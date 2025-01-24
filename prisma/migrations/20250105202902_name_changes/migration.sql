/*
  Warnings:

  - You are about to drop the `UnwantedDay` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UnwantedDay" DROP CONSTRAINT "UnwantedDay_assistantId_fkey";

-- DropForeignKey
ALTER TABLE "UnwantedDay" DROP CONSTRAINT "UnwantedDay_dutyId_fkey";

-- DropTable
DROP TABLE "UnwantedDay";

-- CreateTable
CREATE TABLE "UnwantedDays" (
    "dutyId" UUID NOT NULL,
    "assistantId" UUID NOT NULL,
    "dayIndex" INTEGER[],

    CONSTRAINT "UnwantedDays_pkey" PRIMARY KEY ("dutyId","assistantId")
);

-- AddForeignKey
ALTER TABLE "UnwantedDays" ADD CONSTRAINT "UnwantedDays_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "DutyAssistant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnwantedDays" ADD CONSTRAINT "UnwantedDays_dutyId_fkey" FOREIGN KEY ("dutyId") REFERENCES "Duty"("id") ON DELETE CASCADE ON UPDATE CASCADE;
