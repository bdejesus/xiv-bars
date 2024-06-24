-- DropForeignKey
ALTER TABLE "Layout" DROP CONSTRAINT "Layout_userId_fkey";

-- AddForeignKey
ALTER TABLE "Layout" ADD CONSTRAINT "Layout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
