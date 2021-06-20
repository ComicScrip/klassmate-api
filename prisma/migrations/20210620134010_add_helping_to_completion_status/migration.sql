-- AlterTable
ALTER TABLE `activityParticipation` MODIFY `completionStatus` ENUM('done', 'stucked', 'inProgress', 'helping') NOT NULL DEFAULT 'inProgress';
