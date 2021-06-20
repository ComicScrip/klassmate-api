/*
  Warnings:

  - The primary key for the `activityParticipation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `activityParticipation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `activityParticipation` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`userId`, `activityId`);
