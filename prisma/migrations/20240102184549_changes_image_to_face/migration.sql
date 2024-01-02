/*
  Warnings:

  - You are about to drop the column `image` on the `Character` table. All the data in the column will be lost.
  - Added the required column `face` to the `Character` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Character" DROP COLUMN "image",
ADD COLUMN     "face" TEXT NOT NULL;
