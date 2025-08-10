"use server";

import { db } from "@/db";
import {
  addMovieSchema,
  type AddMovieFormData,
} from "@/lib/formSchemas/addMovieSchema";

import { revalidatePath } from "next/cache";
import { getUserAuth } from "../..";

export async function createMovieAction(data: AddMovieFormData) {
  try {
    const user = await getUserAuth();
    if ("error" in user || !user.sub) {
      return {
        success: false,
        message: "Você precisa estar logado para adicionar um filme",
      };
    }

    const validatedData = addMovieSchema.parse(data);

    const movie = await db.movie.create({
      data: {
        title: validatedData.title,
        description: validatedData.description || "",
        synopsis: validatedData.synopsis,
        imageUrl: validatedData.imageUrl,
        duration: validatedData.duration.toString(), // ex: 120 minutes
        language: validatedData.language,
        status: validatedData.status,
        genres: validatedData.genres
          .split(",")
          .map((g) => g.trim())
          .filter((g) => g.length > 0),
        budget: validatedData.budget ? validatedData.budget.toString() : null, // ex: 135M
        revenue: validatedData.revenue
          ? validatedData.revenue.toString()
          : null, // ex: 460.55M
        profit: validatedData.profit ? validatedData.profit.toString() : null, // ex: 325.94M
        releaseDate: validatedData.releaseDate || null,
        watchedPercentage: validatedData.watchedPercentage || null,
        trailerUrl: validatedData.trailerUrl || null,
        imdbId: validatedData.imdbId || null,
        imdbRating: validatedData.imdbRating || null,
        imdbVotes: validatedData.imdbVotes || null,
        remindUserOnLaunch: validatedData.remindUserOnLaunch || false,
        userId: user.sub,
      },
    });

    if (validatedData.remindUserOnLaunch) {
      await db.movieReleaseReminder.create({
        data: {
          movieId: movie?.id,
          userId: user.sub,
          movieTitle: validatedData.title,
          movieReleaseDate: validatedData.releaseDate || new Date(),
        },
      });
    }

    revalidatePath("/main");

    return {
      success: true,
      message: "Filme adicionado com sucesso!",
    };
  } catch (error) {
    console.error("Error creating movie:", error);

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: "Erro interno do servidor. Tente novamente.",
    };
  }
}

export async function fetchImdbDataAction(
  imdbId: string,
  longPlot: boolean = false
) {
  try {
    // API key from OMDB API (http://www.omdbapi.com/)
    const apiKey = process.env.OMDB_API_KEY;

    if (!apiKey) {
      return {
        success: false,
        message: "API do OMDB não configurada",
        data: null,
      };
    }

    const response = await fetch(
      `http://www.omdbapi.com/?i=${imdbId}&apikey=${apiKey}&plot=${
        longPlot ? "full" : "short"
      }`
    );

    if (!response.ok) {
      return {
        success: false,
        message: "Erro ao buscar dados do OMDB",
        data: null,
      };
    }

    const data = await response.json();

    if (data.Response === "False") {
      return {
        success: false,
        message: data.Error || "Filme não encontrado no OMDB",
        data: null,
      };
    }

    return {
      success: true,
      message: "Dados carregados",
      data,
    };
  } catch (error) {
    console.error("Error fetching OMDB data:", error);
    return {
      success: false,
      message: "Erro ao buscar dados do OMDB",
      data: null,
    };
  }
}
