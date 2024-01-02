/*
  Warnings:

  - You are about to drop the column `body` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `bracelets` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `earrings` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `feet` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `hands` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `head` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `legs` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `mainhand` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `necklace` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `offHand` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `ring1` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `ring2` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `soulstone` on the `Character` table. All the data in the column will be lost.
  - Added the required column `gearSlots` to the `Character` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Character" DROP COLUMN "body",
DROP COLUMN "bracelets",
DROP COLUMN "earrings",
DROP COLUMN "feet",
DROP COLUMN "hands",
DROP COLUMN "head",
DROP COLUMN "legs",
DROP COLUMN "mainhand",
DROP COLUMN "necklace",
DROP COLUMN "offHand",
DROP COLUMN "ring1",
DROP COLUMN "ring2",
DROP COLUMN "soulstone",
ADD COLUMN     "gearSlots" JSONB NOT NULL;
