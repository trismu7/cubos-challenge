"use server";
import { forgotPasswordSchema } from "@/lib/formSchemas/forgotPasswordSchema";
import { z } from "zod";
import { db } from "@/db";
import { sendRecoverPasswordEmail } from "../mailer";

export async function forgotPasswordAction(
  data: z.infer<typeof forgotPasswordSchema>
) {
  try {
    const user = await db.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      return { success: false, message: "Credenciais inválidas" };
    }

    const token = await db.recoverPasswordToken.create({
      data: {
        userId: user.id,
        token: crypto.randomUUID(),
      },
    });

    const { success, message } = await sendRecoverPasswordEmail(
      user.email,
      token.token
    );

    if (success) {
      return {
        success: true,
        message: "Email de recuperação de senha enviado",
      };
    } else {
      return { success: false, message };
    }
  } catch (error) {
    console.error("Erro ao recuperar senha:", error);
    return { success: false, message: "Falha ao recuperar senha" };
  }
}
