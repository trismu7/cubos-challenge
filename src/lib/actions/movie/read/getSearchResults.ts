"use server";
import { db } from "@/db";
import { getUserAuth } from "../..";

export async function getSearchResults(keyword: string) {
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
        OR: [
          { title: { contains: keyword, mode: "insensitive" } },
          { synopsis: { contains: keyword, mode: "insensitive" } },
          { description: { contains: keyword, mode: "insensitive" } },
        ],
      },
    });

    return { success: true, data: movies };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erro ao buscar filmes" };
  }
}
