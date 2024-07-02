/*
  Warnings:

  - A unique constraint covering the columns `[uid]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "uid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_uid_key" ON "User"("uid");
