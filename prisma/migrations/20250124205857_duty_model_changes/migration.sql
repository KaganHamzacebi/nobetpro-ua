/*
  Warnings:

  - You are about to drop the column `disabledDays` on the `DutyAssistant` table. All the data in the column will be lost.
  - The primary key for the `SelectedDay` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `DisabledDays` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UnwantedDays` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DisabledDays" DROP CONSTRAINT "DisabledDays_assistantId_fkey";

-- DropForeignKey
ALTER TABLE "DisabledDays" DROP CONSTRAINT "DisabledDays_dutyId_fkey";

-- DropForeignKey
ALTER TABLE "UnwantedDays" DROP CONSTRAINT "UnwantedDays_assistantId_fkey";

-- DropForeignKey
ALTER TABLE "UnwantedDays" DROP CONSTRAINT "UnwantedDays_dutyId_fkey";

-- AlterTable
ALTER TABLE "Duty" ADD COLUMN     "description" TEXT,
ADD COLUMN     "pinned" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "DutyAssistant" DROP COLUMN "disabledDays";

-- AlterTable
ALTER TABLE "SelectedDay" DROP CONSTRAINT "SelectedDay_pkey",
ADD CONSTRAINT "SelectedDay_pkey" PRIMARY KEY ("assistantId", "dayIndex");

-- DropTable
DROP TABLE "DisabledDays";

-- DropTable
DROP TABLE "UnwantedDays";

-- CreateTable
CREATE TABLE "UnwantedDay" (
    "dutyId" UUID NOT NULL,
    "assistantId" UUID NOT NULL,
    "dayIndex" INTEGER NOT NULL,

    CONSTRAINT "UnwantedDay_pkey" PRIMARY KEY ("assistantId","dayIndex")
);

-- AddForeignKey
ALTER TABLE "UnwantedDay" ADD CONSTRAINT "UnwantedDay_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "DutyAssistant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnwantedDay" ADD CONSTRAINT "UnwantedDay_dutyId_fkey" FOREIGN KEY ("dutyId") REFERENCES "Duty"("id") ON DELETE CASCADE ON UPDATE CASCADE;
