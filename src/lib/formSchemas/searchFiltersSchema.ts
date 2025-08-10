import { z } from "zod";

export const searchFiltersSchema = z
  .object({
    releaseStart: z.date().optional(),
    releaseEnd: z.date().optional(),
    imdbRatingMin: z
      .number({ message: "Nota mínima deve ser um número" })
      .min(0, "Nota mínima não pode ser negativa")
      .max(10, "Nota máxima não pode ser maior que 10")
      .optional(),
    imdbRatingMax: z
      .number({ message: "Nota máxima deve ser um número" })
      .min(0, "Nota máxima não pode ser negativa")
      .max(10, "Nota máxima não pode ser maior que 10")
      .optional(),
    imdbVotesMin: z
      .number({ message: "Votos mínimos deve ser um número" })
      .int("Use apenas números inteiros")
      .min(0, "Votos mínimos não pode ser negativa")
      .optional(),
    imdbVotesMax: z
      .number({ message: "Votos máximos deve ser um número" })
      .int("Use apenas números inteiros")
      .min(0, "Votos máximos não pode ser negativa")
      .optional(),
    durationMin: z
      .number({ message: "Duração mínima deve ser um número" })
      .int("Use apenas números inteiros")
      .min(0, "Duração mínima não pode ser negativa")
      .optional(),
    durationMax: z
      .number({ message: "Duração máxima deve ser um número" })
      .int("Use apenas números inteiros")
      .min(0, "Duração máxima não pode ser negativa")
      .optional(),
  })
  .refine(
    (data) =>
      !data.releaseStart ||
      !data.releaseEnd ||
      data.releaseStart.getTime() <= data.releaseEnd.getTime(),
    {
      message: "Data inicial não pode ser maior que a data final",
      path: ["releaseEnd"],
    }
  )
  .refine(
    (data) =>
      data.durationMin === undefined ||
      data.durationMax === undefined ||
      data.durationMin <= data.durationMax,
    {
      message: "Duração mínima não pode ser maior que a máxima",
      path: ["durationMax"],
    }
  );

export type SearchFilters = z.infer<typeof searchFiltersSchema>;
