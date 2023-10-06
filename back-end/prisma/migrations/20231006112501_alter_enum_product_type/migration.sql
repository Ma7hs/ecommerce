/*
  Warnings:

  - The values [FRITO,ASSADO,BEBIDA,LANCHE_NATURAL,SALADA_DE_FRUTA] on the enum `Product_productType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `product` MODIFY `productType` ENUM('Frito', 'Assado', 'Bebidas', 'Doces', 'Frutas', 'Natural', 'PF') NOT NULL;
