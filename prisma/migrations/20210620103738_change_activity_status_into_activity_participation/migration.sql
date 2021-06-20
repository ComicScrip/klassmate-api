/*
  Warnings:

  - You are about to drop the `activityStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `activityStatus` DROP FOREIGN KEY `activityStatus_ibfk_2`;

-- DropForeignKey
ALTER TABLE `activityStatus` DROP FOREIGN KEY `activityStatus_ibfk_1`;

-- DropTable
DROP TABLE `activityStatus`;

-- CreateTable
CREATE TABLE `activityParticipation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `activityId` INTEGER NOT NULL,
    `completionStatus` ENUM('done', 'stucked', 'inProgress') NOT NULL DEFAULT 'inProgress',
    `energyLevel` DECIMAL(10, 2) NOT NULL,
    `connected` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `activityParticipation` ADD FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activityParticipation` ADD FOREIGN KEY (`activityId`) REFERENCES `activity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
