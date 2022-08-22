/*
  Warnings:

  - A unique constraint covering the columns `[pcid]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "pcid" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_pcid_key" ON "User"("pcid");
