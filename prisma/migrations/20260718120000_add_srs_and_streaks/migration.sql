-- AlterTable
ALTER TABLE "User"
  ADD COLUMN "currentStreak" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "longestStreak" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "lastReviewedAt" DATE;

-- AlterTable
ALTER TABLE "SavedWord"
  ADD COLUMN "srsLevel" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "nextReviewAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "SavedWord_userId_nextReviewAt_idx" ON "SavedWord"("userId", "nextReviewAt");
