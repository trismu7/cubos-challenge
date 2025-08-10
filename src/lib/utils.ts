import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { OmdbResponse } from "./types";
import { AddMovieFormData } from "./formSchemas/addMovieSchema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function processImdbResponse(data: OmdbResponse) {
  const processedData: Partial<AddMovieFormData> = {
    title: data.Title,
    synopsis: data.Plot,
    imageUrl: data.Poster,
    duration: data.Runtime,
    language: data.Language,
    status: data.Rated as
      | "released"
      | "upcoming"
      | "in_production"
      | "cancelled",
    genres: data.Genre,
    revenue: data.BoxOffice,
    imdbId: data.imdbID,
    remindUserOnLaunch: false,
  };

  // Parse release date
  if (data.Released && data.Released !== "N/A") {
    try {
      const parsedDate = new Date(data.Released);
      if (!isNaN(parsedDate.getTime())) {
        const year = parsedDate.getFullYear();
        const month = parsedDate.getMonth();
        const day = parsedDate.getDate();
        processedData.releaseDate = new Date(year, month, day);
      }
    } catch (error) {
      console.log(error);
      console.warn("Failed to parse release date:", data.Released);
    }
  }

  // Parse IMDB rating
  if (data.imdbRating && data.imdbRating !== "N/A") {
    const rating = parseFloat(data.imdbRating);
    if (!isNaN(rating)) {
      processedData.imdbRating = rating.toString();
    }
  }

  // Parse IMDB votes (remove commas first)
  if (data.imdbVotes && data.imdbVotes !== "N/A") {
    const votes = parseInt(data.imdbVotes.replace(/,/g, ""));
    if (!isNaN(votes)) {
      processedData.imdbVotes = votes.toString();
    }
  }

  // Set movie status based on release date and current status
  if (data.Released && data.Released !== "N/A") {
    const releaseDate = new Date(data.Released);
    const now = new Date();

    if (releaseDate <= now) {
      processedData.status = "released";
    } else {
      processedData.status = "upcoming";
    }
  }

  return processedData;
}
