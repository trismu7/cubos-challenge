"use server";
import { db } from "@/db";
import { RegisterFormData } from "../formSchemas/recoverPasswordSchema";
import bcrypt from "bcryptjs";

export async function recoverPasswordAction(
  token: string,
  data: RegisterFormData
) {
  const recoverPasswordToken = await db.recoverPasswordToken.findFirst({
    where: {
      token,
    },
  });

  if (!recoverPasswordToken) {
    return { success: false, message: "Token inválido" };
  }

  const user = await db.user.findUnique({
    where: { id: recoverPasswordToken.userId },
  });

  if (!user) {
    return { success: false, message: "Usuário não encontrado" };
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  await db.recoverPasswordToken.delete({
    where: { id: recoverPasswordToken.id },
  });

  await db.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  return { success: true, message: "Senha atualizada com sucesso" };
}
