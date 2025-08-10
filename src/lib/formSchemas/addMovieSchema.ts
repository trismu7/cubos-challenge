import { z } from "zod";

// MovieStatus enum values from Prisma schema
export const movieStatusValues = [
  "released",
  "upcoming",
  "in_production",
  "cancelled",
] as const;

export const addMovieSchema = z.object({
  // optional, but when provided should be valid
  imdbId: z
    .string()
    .optional()
    .refine((val) => !val || /^tt\d{7,8}$/.test(val), {
      message: "ID do IMDb deve ter o formato ttNNNNNNN",
    }),

  // Required fields
  title: z
    .string()
    .min(1, {
      message: "Título é obrigatório",
    })
    .max(255, {
      message: "Título deve ter no máximo 255 caracteres",
    }),

  description: z.string().optional(),
  synopsis: z
    .string()
    .min(1, {
      message: "Sinopse é obrigatória",
    })
    .max(3000, {
      message: "Sinopse deve ter no máximo 3000 caracteres",
    }),

  imageUrl: z.string({
    message: "URL da imagem deve ser válida",
  }),

  duration: z.string().min(1, {
    message: "Duração deve ser maior que 0 segundos",
  }),

  language: z
    .string()
    .min(1, {
      message: "Idioma é obrigatório",
    })
    .max(50, {
      message: "Idioma deve ter no máximo 50 caracteres",
    }),

  status: z.enum(movieStatusValues, {
    message: "Status deve ser um dos valores válidos",
  }),

  genres: z.string().min(1, {
    message: "Pelo menos um gênero é obrigatório",
  }),

  // Optional fields
  budget: z.string().optional(),

  revenue: z.string().optional(),

  profit: z.string().optional(),

  releaseDate: z
    .date({
      message: "Data de lançamento é obrigatória",
    })
    .optional(),

  watchedPercentage: z
    .number()
    .min(0, {
      message: "Porcentagem assistida deve ser entre 0 e 100",
    })
    .max(100, {
      message: "Porcentagem assistida deve ser entre 0 e 100",
    })
    .optional(),

  trailerUrl: z
    .url({
      message: "URL do trailer deve ser válida",
    })
    .optional()
    .or(z.literal("")),

  imdbRating: z
    .string()
    .min(0, {
      message: "Avaliação do IMDb deve ser maior ou igual a 0",
    })
    .max(10, {
      message: "Avaliação do IMDb deve ser menor ou igual a 10",
    })
    .optional(),

  imdbVotes: z
    .string()
    .min(0, {
      message: "Votos do IMDb deve ser maior ou igual a 0",
    })
    .optional(),

  remindUserOnLaunch: z.boolean(),
});

export type AddMovieFormData = z.infer<typeof addMovieSchema>;
