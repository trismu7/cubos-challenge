import fs from "fs/promises";
import path from "path";
import { OmdbMinimal } from "@/lib/types";

const OMDB_API_KEY = "f3c0ffa9";
if (!OMDB_API_KEY) {
  console.error("OMDB_API_KEY not set in environment.");
  process.exit(1);
}

async function fetchMovie(imdbId: string) {
  const url = `http://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}&plot=short`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${imdbId}: ${res.status}`);
  const data = await res.json();
  if (data.Response === "False")
    throw new Error(`OMDb error ${imdbId}: ${data.Error}`);
  return data;
}

async function main() {
  const root = process.cwd();
  const idsPath = path.join(root, "prisma", "movieIds.json");
  const outPath = path.join(root, "prisma", "movies.json");

  const ids = JSON.parse(await fs.readFile(idsPath, "utf8")) as string[];

  const results: Record<string, OmdbMinimal> = {};
  for (const id of ids) {
    try {
      const data = await fetchMovie(id);
      results[id] = data;
      console.log(`Fetched ${id} - ${data.Title}`);
      // rate limit a bit
      await new Promise((r) => setTimeout(r, 250));
    } catch (e) {
      console.error(e);
    }
  }

  await fs.writeFile(outPath, JSON.stringify(results, null, 2), "utf8");
  console.log(`Saved ${Object.keys(results).length} movies to ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
