"use server";

import { db } from "@/db";
import { getUserAuth } from "@/lib/actions";

export async function getUserMovies() {
  const user = await getUserAuth();
  if ("error" in user || !user.sub) {
    return {
      success: false,
      message: "Você precisa estar logado",
    };
  }

  try {
    const movies = await db.movie.findMany({
      where: {
        userId: user.sub,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      message: "Filmes carregados",
      data: movies,
    };
  } catch (error) {
    console.error("Error getting user movies:", error);
    return {
      success: false,
      message: "Erro ao carregar filmes",
    };
  }
}
