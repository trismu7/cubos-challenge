import { z } from "zod";

export const recoverPasswordSchema = z
  .object({
    password: z.string().min(6, {
      message: "Senha deve ter no mínimo 6 caracteres",
    }),
    confirmPassword: z.string().min(6, {
      message: "Confirmação de senha deve ter no mínimo 6 caracteres",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof recoverPasswordSchema>;
