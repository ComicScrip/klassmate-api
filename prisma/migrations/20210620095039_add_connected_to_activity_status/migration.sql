/*
  Warnings:

  - Added the required column `connected` to the `activityStatus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `activityStatus` ADD COLUMN `connected` BOOLEAN NOT NULL;
