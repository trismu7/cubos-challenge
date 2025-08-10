/*
  Warnings:

  - You are about to drop the `Genre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GenreToMovie` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_GenreToMovie" DROP CONSTRAINT "_GenreToMovie_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_GenreToMovie" DROP CONSTRAINT "_GenreToMovie_B_fkey";

-- AlterTable
ALTER TABLE "public"."Movie" ADD COLUMN     "genres" TEXT[],
ALTER COLUMN "duration" SET DATA TYPE TEXT,
ALTER COLUMN "budget" DROP NOT NULL,
ALTER COLUMN "budget" SET DATA TYPE TEXT,
ALTER COLUMN "revenue" DROP NOT NULL,
ALTER COLUMN "revenue" SET DATA TYPE TEXT,
ALTER COLUMN "profit" DROP NOT NULL,
ALTER COLUMN "profit" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "public"."Genre";

-- DropTable
DROP TABLE "public"."_GenreToMovie";
