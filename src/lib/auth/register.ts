"use server";
import { z } from "zod";
import { cookies } from "next/headers";
import { db } from "@/db";
import bcrypt from "bcryptjs";
import { openSessionToken, createSessionToken } from "./jwt";
import { registerSchema } from "../formSchemas/registerSchema";
import { sendWelcomeEmail } from "../mailer";

export async function registerAction(data: z.infer<typeof registerSchema>) {
  const payload = {
    username: data.username.trim(),
    name: data.name.trim(),
    email: data.email.trim(),
    password: data.password.trim(),
  };

  try {
    const user = await db.user.findFirst({
      where: {
        OR: [{ username: data.username.trim() }, { email: data.email.trim() }],
      },
    });

    if (user) {
      return { success: false, message: "Usuário já existe" };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await db.user.create({
      data: {
        username: data.username.trim(),
        name: data.name.trim(),
        email: data.email.trim(),
        password: hashedPassword,
      },
    });

    const session = await createSessionToken(payload, newUser.id.toString());

    const response = await openSessionToken(session);

    if (response) {
      (await cookies()).set("cubos-movies-session", session, {
        expires: (response.exp as number) * 1000,
        path: "/",
        httpOnly: true,
      });

      await sendWelcomeEmail(payload.email);
    }

    return { success: true, message: "Seu registro foi realizado com sucesso" };
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return { success: false, message: "Falha ao criar usuário" };
  }
}
