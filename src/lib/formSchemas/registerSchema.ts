import { z } from "zod";

export const registerSchema = z
  .object({
    username: z.string().min(1, {
      message: "Nome de usuário é obrigatório",
    }),
    name: z.string().min(1, {
      message: "Nome é obrigatório",
    }),
    email: z.email({
      message: "E-mail inválido",
    }),
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

export type RegisterFormData = z.infer<typeof registerSchema>;
