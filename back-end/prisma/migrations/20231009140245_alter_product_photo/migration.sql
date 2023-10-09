/*
  Warnings:

  - The values [PF] on the enum `Product_productType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `product` MODIFY `photo` TEXT NOT NULL,
    MODIFY `productType` ENUM('Frito', 'Assado', 'Bebidas', 'Doces', 'Frutas', 'Natural', 'P') NOT NULL;
