-- AlterTable
ALTER TABLE "Layout" ADD COLUMN     "locale" TEXT DEFAULT 'en',
ADD COLUMN     "parentId" INTEGER;

-- AddForeignKey
ALTER TABLE "Layout" ADD CONSTRAINT "Layout_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Layout"("id") ON DELETE SET NULL ON UPDATE CASCADE;
