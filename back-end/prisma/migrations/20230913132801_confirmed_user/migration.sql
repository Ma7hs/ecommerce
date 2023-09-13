/*
  Warnings:

  - Added the required column `confirmed` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `confirmed` BOOLEAN NOT NULL;
