import { OmdbMinimal } from "@/lib/types";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

//clear users and movies, then seed the database from the cached OMDb response file "movies.json"
async function main() {
  try {
    await prisma.movie.deleteMany();
    await prisma.user.deleteMany();

    const password = await bcrypt.hash("123456", 10);

    const user = await prisma.user.create({
      data: {
        name: "User",
        email: "user@user.com",
        username: "user",
        password,
      },
    });

    // seed movies from cached OMDb response file if available
    const root = process.cwd();
    const moviesPath = path.join(root, "prisma", "movies.json");
    const raw = await fs.readFile(moviesPath, "utf8");
    const byId = JSON.parse(raw) as Record<string, unknown>;

    const userId = user.id;

    for (const value of Object.values(byId)) {
      const data = value as OmdbMinimal;
      const releaseDate =
        data.Released && data.Released !== "N/A"
          ? new Date(data.Released)
          : null;
      const imdbRating =
        data.imdbRating && data.imdbRating !== "N/A"
          ? String(parseFloat(data.imdbRating))
          : null;
      const imdbVotes =
        data.imdbVotes && data.imdbVotes !== "N/A"
          ? String(parseInt(String(data.imdbVotes).replace(/,/g, "")))
          : null;

      if (!data.imdbID) continue;

      await prisma.movie.upsert({
        where: { imdbId: data.imdbID },
        update: {},
        create: {
          title: data.Title || "Untitled",
          description: data.Plot || "",
          synopsis: data.Plot || "",
          imageUrl: data.Poster || "",
          duration: data.Runtime || "",
          language: data.Language || "",
          status:
            releaseDate && releaseDate <= new Date() ? "released" : "upcoming",
          genres: String(data.Genre || "")
            .split(",")
            .map((g: string) => g.trim())
            .filter((g: string) => g.length > 0),
          budget:
            data.BoxOffice && data.BoxOffice !== "N/A" ? data.BoxOffice : null,
          revenue:
            data.BoxOffice && data.BoxOffice !== "N/A" ? data.BoxOffice : null,
          profit: null,
          releaseDate,
          watchedPercentage: 0,
          trailerUrl: null,
          imdbId: data.imdbID,
          imdbRating,
          imdbVotes,
          remindUserOnLaunch: false,
          userId,
        },
      });
    }

    console.log(
      "Database seeded successfully, login with 'user' and password '123456'"
    );
  } catch (e) {
    console.warn("No cached movies found or failed to seed from cache.", e);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
