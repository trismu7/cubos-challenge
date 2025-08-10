-- AlterTable
ALTER TABLE "public"."Movie" ADD COLUMN     "originalTitle" TEXT,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "imdbRating" SET DATA TYPE TEXT,
ALTER COLUMN "imdbVotes" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "public"."RecoverPasswordToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "RecoverPasswordToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MovieReleaseReminder" (
    "id" TEXT NOT NULL,
    "movieTitle" TEXT NOT NULL,
    "movieReleaseDate" TIMESTAMP(3) NOT NULL,
    "alreadySent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,

    CONSTRAINT "MovieReleaseReminder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MovieReleaseReminder_movieId_userId_key" ON "public"."MovieReleaseReminder"("movieId", "userId");

-- AddForeignKey
ALTER TABLE "public"."RecoverPasswordToken" ADD CONSTRAINT "RecoverPasswordToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MovieReleaseReminder" ADD CONSTRAINT "MovieReleaseReminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MovieReleaseReminder" ADD CONSTRAINT "MovieReleaseReminder_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "public"."Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
