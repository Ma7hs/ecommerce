-- AlterTable
ALTER TABLE `user` MODIFY `userType` ENUM('COLABORATOR', 'CUSTOMER', 'ADMIN') NOT NULL;

-- CreateTable
CREATE TABLE `StoreStatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL,
    `status` ENUM('OPEN', 'CLOSED') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
