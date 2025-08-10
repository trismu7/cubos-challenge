import { z } from "zod";

export const loginSchema = z.object({
  emailOrUsername: z.string().min(1, {
    message: "E-mail ou nome de usuário é obrigatório",
  }),
  password: z.string().min(6, {
    message: "Senha deve ter no mínimo 6 caracteres",
  }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
