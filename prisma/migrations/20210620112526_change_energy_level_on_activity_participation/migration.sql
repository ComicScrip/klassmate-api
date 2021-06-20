/*
  Warnings:

  - You are about to alter the column `energyLevel` on the `activityParticipation` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Int`.

*/
-- AlterTable
ALTER TABLE `activityParticipation` MODIFY `energyLevel` INTEGER;
