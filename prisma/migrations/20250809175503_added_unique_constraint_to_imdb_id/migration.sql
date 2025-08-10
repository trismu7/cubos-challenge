/*
  Warnings:

  - A unique constraint covering the columns `[imdbId]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Movie_imdbId_key" ON "public"."Movie"("imdbId");
