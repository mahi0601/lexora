-- AlterTable
ALTER TABLE "SavedWord"
  ADD COLUMN "isCustom" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "CategoryWordList" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "words" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CategoryWordList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CategoryWordList_slug_key" ON "CategoryWordList"("slug");
