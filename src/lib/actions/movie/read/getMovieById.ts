"use server";

import { db } from "@/db";
import { getUserAuth } from "../..";

export async function getMovieById(id: string) {
  const user = await getUserAuth();
  if ("error" in user || !user.sub) {
    return {
      success: false,
      message: "Você precisa estar logado",
    };
  }

  try {
    const movie = await db.movie.findUnique({
      where: {
        id,
        userId: user.sub,
      },
    });

    return {
      success: true,
      message: "Filme carregado",
      data: movie,
    };
  } catch (error) {
    console.error("Error getting movie by id:", error);
    return {
      success: false,
      message: "Erro ao buscar filme",
    };
  }
}
