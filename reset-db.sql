DROP TABLE IF EXISTS `notes`;
CREATE TABLE `notes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
INSERT INTO
  `notes` (title, content)
VALUES
  ('Note1', 'content note 1'),
  ('Note2', 'content note 2');