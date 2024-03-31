-- DropForeignKey
ALTER TABLE "Heart" DROP CONSTRAINT "Heart_layoutId_fkey";

-- DropForeignKey
ALTER TABLE "Heart" DROP CONSTRAINT "Heart_userId_fkey";

-- AddForeignKey
ALTER TABLE "Heart" ADD CONSTRAINT "Heart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Heart" ADD CONSTRAINT "Heart_layoutId_fkey" FOREIGN KEY ("layoutId") REFERENCES "Layout"("id") ON DELETE CASCADE ON UPDATE CASCADE;
