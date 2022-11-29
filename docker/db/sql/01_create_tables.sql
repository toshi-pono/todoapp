-- Table for tasks
DROP TABLE IF EXISTS `tasks`;

CREATE TABLE `tasks` (
    `id` char(36) PRIMARY KEY,
    `title` varchar(50) NOT NULL,
    `description` varchar(255) NOT NULL DEFAULT '',
    `is_done` boolean NOT NULL DEFAULT b'0',
    `priority` int(11) NOT NULL DEFAULT '0',
    `deadline` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
    `id` char(36) PRIMARY KEY,
    `name`       varchar(50) NOT NULL UNIQUE,
    `password`   binary(32) NOT NULL,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `ownership`;
 
CREATE TABLE `ownership` (
    `user_id` char(36) NOT NULL,
    `task_id` char(36) NOT NULL,
    PRIMARY KEY (`user_id`, `task_id`)
) DEFAULT CHARSET=utf8mb4;
