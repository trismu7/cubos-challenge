"use server";
import { db } from "@/db";
import { getUserAuth } from "@/lib/actions";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";

export async function deleteMovieAction(id: string) {
  const user = await getUserAuth();

  if ("error" in user || !user.sub) {
    return {
      success: false,
      message: "Você precisa estar logado para deletar um filme",
    };
  }

  const movie = await db.movie.findUnique({
    where: { id, userId: user.sub },
  });

  if (!movie) {
    return { success: false, message: "Filme não encontrado" };
  }

  await db.movie.delete({
    where: { id },
  });

  revalidatePath(`/main/movie/${id}`);

  return { success: true, message: "Filme removido com sucesso" };
}
