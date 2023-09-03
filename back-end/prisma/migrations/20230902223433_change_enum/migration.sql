/*
  Warnings:

  - You are about to drop the column `activeCart` on the `cartsbyuser` table. All the data in the column will be lost.
  - Added the required column `status` to the `CartsByUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cartsbyuser` DROP COLUMN `activeCart`,
    ADD COLUMN `status` ENUM('ACTIVE', 'DISABLE') NOT NULL;
