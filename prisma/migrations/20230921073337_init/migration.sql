-- CreateTable
CREATE TABLE `Users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` TEXT NOT NULL,
    `password` TEXT NOT NULL,
    `fullname` TEXT NOT NULL,
    `email` TEXT NOT NULL,
    `level` ENUM('Administrator', 'User') NOT NULL DEFAULT 'User',
    `status` ENUM('Active', 'Inactive', 'Publish', 'Draft') NOT NULL DEFAULT 'Active',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Banner` (
    `banner_id` INTEGER NOT NULL AUTO_INCREMENT,
    `post_date` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `topic` TEXT NOT NULL,
    `filename` TEXT NOT NULL,
    `status` ENUM('Active', 'Inactive', 'Publish', 'Draft') NOT NULL DEFAULT 'Active',
    `active` ENUM('Yes', 'No') NOT NULL DEFAULT 'Yes',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `arr` INTEGER NOT NULL,

    PRIMARY KEY (`banner_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `News` (
    `news_id` INTEGER NOT NULL AUTO_INCREMENT,
    `post_date` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `topic` TEXT NOT NULL,
    `detail` TEXT NOT NULL,
    `status` ENUM('Active', 'Inactive', 'Publish', 'Draft') NOT NULL DEFAULT 'Publish',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`news_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Contact` (
    `contact_id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullname` TEXT NOT NULL,
    `company_name` TEXT NOT NULL,
    `phone_number` TEXT NOT NULL,
    `email` TEXT NOT NULL,
    `message` TEXT NOT NULL,
    `subject` TEXT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`contact_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
