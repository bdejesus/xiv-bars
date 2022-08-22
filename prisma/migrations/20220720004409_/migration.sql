/*
  Warnings:

  - Added the required column `user_id` to the `Layout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Layout" ADD COLUMN     "user_id" INTEGER NOT NULL;
