/*
  Warnings:

  - You are about to drop the `DutyMonthConfig` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dutyMonth` to the `Duty` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DutyMonthConfig" DROP CONSTRAINT "DutyMonthConfig_dutyId_fkey";

-- AlterTable
ALTER TABLE "Duty" ADD COLUMN     "dutyMonth" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "DutyMonthConfig";
