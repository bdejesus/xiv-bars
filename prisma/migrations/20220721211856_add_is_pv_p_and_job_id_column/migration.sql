/*
  Warnings:

  - Added the required column `jobId` to the `Layout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Layout" ADD COLUMN     "isPvp" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "jobId" INTEGER NOT NULL;
