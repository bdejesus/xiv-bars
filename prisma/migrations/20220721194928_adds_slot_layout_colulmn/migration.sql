/*
  Warnings:

  - Added the required column `slotLayout` to the `Layout` table without a default value. This is not possible if the table is not empty.
  - Made the column `slots` on table `Layout` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `Layout` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Layout" ADD COLUMN     "slotLayout" INTEGER NOT NULL,
ALTER COLUMN "slots" SET NOT NULL,
ALTER COLUMN "title" SET NOT NULL;
