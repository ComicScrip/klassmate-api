-- AlterTable
ALTER TABLE
  `activityParticipation`
MODIFY
  `completionStatus` ENUM('done', 'stuck', 'inProgress', 'helping') NOT NULL DEFAULT 'inProgress';