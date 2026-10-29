-- AlterTable
ALTER TABLE "notes" ADD COLUMN     "is_trashed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "trashed_at" TIMESTAMP(3);
