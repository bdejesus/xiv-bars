/*
  Warnings:

  - You are about to drop the column `name` on the `Layout` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Layout` table. All the data in the column will be lost.
  - You are about to drop the column `pcid` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[characterId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Layout` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- DropIndex
DROP INDEX "User_pcid_key";

-- AlterTable
ALTER TABLE "Layout" DROP COLUMN "name",
DROP COLUMN "user_id",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "pcid",
ADD COLUMN     "characterId" INTEGER,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- CreateIndex
CREATE UNIQUE INDEX "User_characterId_key" ON "User"("characterId");

-- AddForeignKey
ALTER TABLE "Layout" ADD CONSTRAINT "Layout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
