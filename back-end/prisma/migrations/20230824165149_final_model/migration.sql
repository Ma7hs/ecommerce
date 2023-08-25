-- AlterTable
ALTER TABLE `movementextract` MODIFY `movementType` ENUM('DEPOSIT', 'SPEND', 'RETURN') NOT NULL;
