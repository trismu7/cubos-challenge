"use server";
import {
  AddMovieFormData,
  addMovieSchema,
} from "@/lib/formSchemas/addMovieSchema";
import { db } from "@/db";
import { getUserAuth } from "@/lib/actions";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";

export async function updateMovieAction(data: AddMovieFormData, id: string) {
  try {
    const user = await getUserAuth();

    const validatedData = addMovieSchema.parse(data);

    if ("error" in user || !user.sub) {
      return {
        success: false,
        message: "Você precisa estar logado para adicionar um filme",
      };
    }

    const movie = await db.movie.findUnique({
      where: { id, userId: user.sub },
    });

    if (!movie) {
      return { success: false, message: "Filme não encontrado" };
    }

    const updatedMovie = await db.movie.update({
      where: { id },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        synopsis: validatedData.synopsis,
        imageUrl: validatedData.imageUrl,
        duration: validatedData.duration.toString(),
        language: validatedData.language,
        status: validatedData.status,
        genres: validatedData.genres
          .split(",")
          .map((g) => g.trim())
          .filter((g) => g.length > 0),
        budget: validatedData.budget ? validatedData.budget.toString() : null,
        revenue: validatedData.revenue
          ? validatedData.revenue.toString()
          : null,
        profit: validatedData.profit ? validatedData.profit.toString() : null,
        releaseDate: validatedData.releaseDate || null,
        watchedPercentage: validatedData.watchedPercentage || null,
        trailerUrl: validatedData.trailerUrl || null,
        imdbId: validatedData.imdbId || null,
        imdbRating: validatedData.imdbRating || null,
        imdbVotes: validatedData.imdbVotes || null,
        remindUserOnLaunch: validatedData.remindUserOnLaunch || false,
      },
    });

    // Create reminder if user checks the box and there is no reminder
    if (validatedData.remindUserOnLaunch && !movie.remindUserOnLaunch) {
      await db.movieReleaseReminder.create({
        data: {
          movieId: movie?.id,
          userId: user.sub,
          movieTitle: validatedData.title,
          movieReleaseDate: validatedData.releaseDate || new Date(),
        },
      });
    }

    // Cancel reminder if user unchecks the box and there is a reminder
    if (!validatedData.remindUserOnLaunch && movie.remindUserOnLaunch) {
      await db.movieReleaseReminder.delete({
        where: {
          movieId_userId: {
            movieId: movie?.id,
            userId: user.sub,
          },
        },
      });
    }

    revalidatePath(`/main/movie/${id}`);

    return {
      success: true,
      message: "Filme atualizado com sucesso",
      movie: updatedMovie,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erro ao atualizar filme" };
  }
}
