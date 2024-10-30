/*
  Warnings:

  - You are about to drop the column `column` on the `Tasks` table. All the data in the column will be lost.
  - Added the required column `description` to the `Groups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Groups` ADD COLUMN `description` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `Tasks` DROP COLUMN `column`;
