-- DropForeignKey
ALTER TABLE `activecartsbyuser` DROP FOREIGN KEY `ActiveCartsByUser_cartsByUserId_fkey`;

-- DropForeignKey
ALTER TABLE `activecartsbyuser` DROP FOREIGN KEY `ActiveCartsByUser_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `balance` DROP FOREIGN KEY `Balance_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `cartsbyuser` DROP FOREIGN KEY `CartsByUser_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `customer` DROP FOREIGN KEY `Customer_userId_fkey`;

-- DropForeignKey
ALTER TABLE `favorite` DROP FOREIGN KEY `Favorite_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `favorite` DROP FOREIGN KEY `Favorite_productId_fkey`;

-- DropForeignKey
ALTER TABLE `movementextract` DROP FOREIGN KEY `MovementExtract_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `productsbycart` DROP FOREIGN KEY `ProductsByCart_cartsByUserId_fkey`;

-- DropForeignKey
ALTER TABLE `productsbycart` DROP FOREIGN KEY `ProductsByCart_productId_fkey`;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Balance` ADD CONSTRAINT `Balance_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MovementExtract` ADD CONSTRAINT `MovementExtract_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Favorite` ADD CONSTRAINT `Favorite_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Favorite` ADD CONSTRAINT `Favorite_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartsByUser` ADD CONSTRAINT `CartsByUser_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActiveCartsByUser` ADD CONSTRAINT `ActiveCartsByUser_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActiveCartsByUser` ADD CONSTRAINT `ActiveCartsByUser_cartsByUserId_fkey` FOREIGN KEY (`cartsByUserId`) REFERENCES `CartsByUser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductsByCart` ADD CONSTRAINT `ProductsByCart_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductsByCart` ADD CONSTRAINT `ProductsByCart_cartsByUserId_fkey` FOREIGN KEY (`cartsByUserId`) REFERENCES `CartsByUser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
