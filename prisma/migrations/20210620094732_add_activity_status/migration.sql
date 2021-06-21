-- CreateTable
CREATE TABLE `activityStatus` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `userId` INTEGER NOT NULL,
  `activityId` INTEGER NOT NULL,
  `completionStatus` ENUM('done', 'stuck', 'inProgress') NOT NULL DEFAULT 'inProgress',
  `energyLevel` DECIMAL(10, 2) NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- AddForeignKey
ALTER TABLE
  `activityStatus`
ADD
  FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE
  `activityStatus`
ADD
  FOREIGN KEY (`activityId`) REFERENCES `activity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;