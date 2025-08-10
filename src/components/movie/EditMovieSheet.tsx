"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  addMovieSchema,
  type AddMovieFormData,
  movieStatusValues,
} from "@/lib/formSchemas/addMovieSchema";
import { fetchImdbDataAction } from "@/lib/actions/movie/create/createMovie";
import { updateMovieAction } from "@/lib/actions/movie/update/updateMovie";
import { processImdbResponse } from "@/lib/utils";
import { Movie } from "@prisma/client";
import { Slider } from "@/components/ui/slider";

export default function EditMovieSheet({ movie }: { movie: Movie }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFetchingImdb, setIsFetchingImdb] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [longPlot, setLongPlot] = useState(false);

  const editMovieForm = useForm<AddMovieFormData>({
    resolver: zodResolver(addMovieSchema),
    defaultValues: {
      imdbId: movie.imdbId || undefined,
      title: movie.title,
      description: movie.description || "",
      synopsis: movie.synopsis,
      imageUrl: movie.imageUrl,
      duration: movie.duration,
      language: movie.language,
      status: movie.status,
      genres: movie.genres.join(", "),
      budget: movie.budget || "",
      revenue: movie.revenue || "",
      profit: movie.profit || "",
      // Ensure Date object
      releaseDate: movie.releaseDate
        ? new Date(movie.releaseDate as unknown as string)
        : undefined,
      watchedPercentage: movie.watchedPercentage || 0,
      trailerUrl: movie.trailerUrl || "",
      imdbRating: movie.imdbRating || "",
      imdbVotes: movie.imdbVotes || "",
      remindUserOnLaunch: movie.remindUserOnLaunch ?? false,
    },
  });

  // Visibility for "remindUserOnLaunch" checkbox
  const watchedStatus = editMovieForm.watch("status");
  const watchedReleaseDate = editMovieForm.watch("releaseDate");
  const shouldShowReminder =
    watchedStatus !== "released" &&
    watchedStatus !== "cancelled" &&
    watchedReleaseDate instanceof Date &&
    watchedReleaseDate.getTime() > Date.now();

  const handleFetchImdbData = async () => {
    const imdbId = editMovieForm.getValues("imdbId");
    if (!imdbId) {
      toast.error("Digite um ID do IMDB válido");
      return;
    }

    setIsFetchingImdb(true);
    try {
      const result = await fetchImdbDataAction(imdbId, longPlot);

      if (result.success && result.data) {
        const processedData = processImdbResponse(result.data);

        Object.entries(processedData).forEach(([key, value]) => {
          if (value !== undefined) {
            editMovieForm.setValue(
              key as keyof AddMovieFormData,
              value as never
            );
          }
        });

        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Erro ao buscar dados do IMDB");
    } finally {
      setIsFetchingImdb(false);
    }
  };

  const handleSubmit = async (data: AddMovieFormData) => {
    setIsSubmitting(true);

    try {
      const result = await updateMovieAction(data, movie.id);

      if (result.success) {
        toast.success(result.message);
        setIsOpen(false);
      } else {
        toast.error(result?.message || "Erro ao editar filme");
      }
    } catch {
      toast.error("Erro ao editar filme");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="grow">Editar</Button>
      </SheetTrigger>

      <SheetContent className="sm:max-w-[600px] overflow-y-auto p-4">
        <SheetHeader>
          <SheetTitle>Editar filme</SheetTitle>
        </SheetHeader>

        <Form {...editMovieForm}>
          <form
            onSubmit={editMovieForm.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* IMDB ID with fetch button */}
            <div className="flex gap-2 flex-col md:flex-row">
              <FormField
                control={editMovieForm.control}
                name="imdbId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="font-semibold">
                      ID do IMDB (opcional)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="ex: tt3896198" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-end gap-2">
                <Button
                  type="button"
                  onClick={() => setLongPlot(!longPlot)}
                  variant="secondary"
                >
                  {longPlot ? "Sinopse longa" : "Sinopse curta"}
                </Button>
                <Button
                  type="button"
                  className="grow"
                  onClick={handleFetchImdbData}
                  disabled={isFetchingImdb}
                >
                  {isFetchingImdb ? "Buscando..." : "Buscar dados"}
                </Button>
              </div>
            </div>

            {/* Required fields */}
            <FormField
              control={editMovieForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Título *</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o título do filme" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={editMovieForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Descrição (opcional)
                  </FormLabel>
                  <FormControl>
                    <textarea
                      className="bg-input border-border flex min-h-[80px] w-full rounded border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Digite uma descrição para o filme"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={editMovieForm.control}
              name="synopsis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Sinopse *</FormLabel>
                  <FormControl>
                    <textarea
                      className="bg-input border-border flex min-h-[100px] w-full rounded border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Digite a sinopse do filme"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={editMovieForm.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    URL da imagem de capa *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://exemplo.com/poster.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={editMovieForm.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Duração *</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="ex: 1h 30m ou 120 min"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editMovieForm.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Idioma *</FormLabel>
                    <FormControl>
                      <Input placeholder="Português" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={editMovieForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Status *</FormLabel>
                    <FormControl>
                      <select
                        className="bg-input flex h-10 w-full rounded border border-border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        {movieStatusValues.map((status) => (
                          <option key={status} value={status}>
                            {status === "released" && "Lançado"}
                            {status === "upcoming" && "Em breve"}
                            {status === "in_production" && "Em produção"}
                            {status === "cancelled" && "Cancelado"}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editMovieForm.control}
                name="genres"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Gêneros *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ação, Aventura, Comédia"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Optional fields */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold">Campos opcionais</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <FormField
                  control={editMovieForm.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Orçamento ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="1000000"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? e.target.value : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editMovieForm.control}
                  name="revenue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Receita ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="2000000"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? e.target.value : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editMovieForm.control}
                  name="profit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lucro ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="1000000"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? e.target.value : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={editMovieForm.control}
                  name="releaseDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de lançamento</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={
                            field.value
                              ? field.value.toISOString().split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? new Date(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editMovieForm.control}
                  name="watchedPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Assistido <b>{field.value}%</b>
                      </FormLabel>
                      <FormControl>
                        <Slider
                          min={0}
                          max={100}
                          step={1}
                          value={[field.value ?? 0]}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={editMovieForm.control}
                name="trailerUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL do Trailer</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://youtube.com/watch?v=..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={editMovieForm.control}
                  name="imdbRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avaliação IMDB</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="7.6"
                          {...field}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editMovieForm.control}
                  name="imdbVotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Votos IMDB</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="802014"
                          {...field}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {shouldShowReminder && (
                <FormField
                  control={editMovieForm.control}
                  name="remindUserOnLaunch"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">
                        Receber lembrete no lançamento
                      </FormLabel>
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar filme"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
