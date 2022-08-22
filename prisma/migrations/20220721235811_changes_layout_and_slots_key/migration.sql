/*
  Warnings:

  - You are about to drop the column `slotLayout` on the `Layout` table. All the data in the column will be lost.
  - You are about to drop the column `slots` on the `Layout` table. All the data in the column will be lost.
  - Added the required column `encodedSlots` to the `Layout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `layout` to the `Layout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Layout" DROP COLUMN "slotLayout",
DROP COLUMN "slots",
ADD COLUMN     "encodedSlots" TEXT NOT NULL,
ADD COLUMN     "layout" INTEGER NOT NULL;
