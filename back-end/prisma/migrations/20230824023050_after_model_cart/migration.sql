-- AlterTable
ALTER TABLE `customer` MODIFY `photo` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `CartsByUser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `activeCart` ENUM('ACTIVE', 'DISABLE') NOT NULL,
    `customerId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActiveCartsByUser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `cartsByUserId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductsByCart` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `productId` INTEGER NOT NULL,
    `cartsByUserId` INTEGER NOT NULL,
    `qntd` INTEGER NOT NULL,
    `total_value` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CartsByUser` ADD CONSTRAINT `CartsByUser_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActiveCartsByUser` ADD CONSTRAINT `ActiveCartsByUser_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActiveCartsByUser` ADD CONSTRAINT `ActiveCartsByUser_cartsByUserId_fkey` FOREIGN KEY (`cartsByUserId`) REFERENCES `CartsByUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductsByCart` ADD CONSTRAINT `ProductsByCart_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductsByCart` ADD CONSTRAINT `ProductsByCart_cartsByUserId_fkey` FOREIGN KEY (`cartsByUserId`) REFERENCES `CartsByUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
