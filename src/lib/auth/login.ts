"use server";
import { loginSchema } from "@/lib/formSchemas/loginSchema";
import { z } from "zod";
import { cookies } from "next/headers";
import { db } from "@/db";
import bcrypt from "bcryptjs";
import { openSessionToken, createSessionToken } from "./jwt";

export async function loginAction(data: z.infer<typeof loginSchema>) {
  const payload = {
    emailOrUsername: data.emailOrUsername.trim(),
    password: data.password.trim(),
  };

  try {
    const user = await db.user.findFirst({
      where: {
        OR: [
          { email: data.emailOrUsername.trim() },
          { username: data.emailOrUsername.trim() },
        ],
      },
    });

    if (!user) {
      return { success: false, message: "Credenciais inválidas" };
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      return { success: false, message: "Credenciais inválidas" };
    }

    const session = await createSessionToken(payload, user.id.toString());

    const response = await openSessionToken(session);

    if (response) {
      (await cookies()).set("cubos-movies-session", session, {
        expires: (response.exp as number) * 1000,
        path: "/",
        httpOnly: true,
      });

      return { success: true, message: "Login realizado com sucesso" };
    }

    return { success: false, message: "Falha ao realizar login" };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Falha ao realizar login" };
  }
}
