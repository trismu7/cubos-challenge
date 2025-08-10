import { getMovieById } from "@/lib/actions/movie/read/getMovieById";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import EditMovieSheet from "@/components/movie/EditMovieSheet";
import { Movie } from "@prisma/client";
import DeleteMovieDialog from "@/components/movie/DeleteMovieDialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
});

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const movie = await getMovieById(id);
  if (!movie.success) {
    return (
      <div className="p-6 flex flex-col gap-4 h-full">{movie.message}</div>
    );
  }

  return (
    <div
      className={`p-6 flex flex-col gap-4 min-h-[calc(100vh-130px)] ${montserrat.variable} font-montserrat`}
    >
      <Link href="/main" className="max-md:w-full">
        <Button
          className="max-md:w-full grow min-md:hidden"
          variant="secondary"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Voltar
        </Button>
        <Button className="max-md:hidden">
          <ArrowLeftIcon className="w-4 h-4" />
          Voltar
        </Button>
      </Link>
      <div className="md:p-6 rounded-sm bg-gradient-to-b light:from-black/[0.08] light:via-black/[0.08] light:to-white/10 dark:from-white/[0.08] dark:via-white/[0.08] dark:to-black/10 backdrop-blur-sm">
        <div className="flex items-center justify-between max-md:hidden">
          <div className="flex flex-col light:text-mauve-dark-12">
            <p className="text-[32px] font-semibold">{movie.data?.title}</p>
            <p>Título original: {movie.data?.title}</p>
          </div>

          <div className="flex items-center gap-2 font-roboto font-medium">
            <DeleteMovieDialog movieId={movie.data?.id as string} />
            <EditMovieSheet movie={movie.data as Movie} />
          </div>
        </div>

        <div className="flex flex-col min-[1030px]:flex-row gap-4 md:mt-4">
          <Image
            src={movie.data?.imageUrl || ""}
            alt={movie.data?.title || ""}
            width={374}
            height={542}
            className="rounded-sm self-center object-cover max-md:w-full"
            priority
            quality={100}
          />

          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col items-center justify-between md:hidden w-full px-4">
              <div className="flex items-center gap-2 font-roboto font-medium w-full">
                <DeleteMovieDialog movieId={movie.data?.id as string} />
                <EditMovieSheet movie={movie.data as Movie} />
              </div>
            </div>
            <div className="flex flex-col p-4 lg:p-0 md:hidden light:text-mauve-dark-12">
              <p className="text-[32px] font-semibold">{movie.data?.title}</p>
              <p>Título original: {movie.data?.title}</p>
            </div>
            <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 light:text-black">
              <i className="text-sm md:text-base text-center p-4 py-5 rounded-sm light:bg-mauve-dark-1/[0.7] light:backdrop-blur-sm">
                {movie.data?.description || "N/A"}
              </i>

              <div className="flex flex-wrap md:flex-nowrap gap-4 items-center">
                <MovieInfoCard
                  title="Avaliação IMDB"
                  value={movie.data?.imdbRating?.toString() || "N/A"}
                />

                <MovieInfoCard
                  title="Votos IMDB"
                  value={movie.data?.imdbVotes?.toString() || "N/A"}
                />

                <div className="flex flex-col justify-between">
                  {/* Top section with progress circle */}
                  <div className="flex justify-center">
                    <div className="relative w-24 h-24 md:w-30 md:h-30 rounded-full backdrop-blur-sm">
                      {/* Background circle */}
                      <svg
                        className="w-24 h-24 md:w-30 md:h-30 transform -rotate-90"
                        viewBox="0 0 80 80"
                      >
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.2)"
                          strokeWidth="6"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          fill="none"
                          stroke="#fbbf24"
                          strokeWidth="6"
                          strokeDasharray={`${2 * Math.PI * 32}`}
                          strokeDashoffset={`${
                            2 *
                            Math.PI *
                            32 *
                            (1 - (movie.data?.watchedPercentage || 0) / 100)
                          }`}
                          className="transition-all duration-500"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {movie.data?.watchedPercentage?.toString() || "0"}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex flex-col gap-4 w-full lg:max-w-1/2">
                <MovieInfoCard
                  title="Sinopse"
                  value={movie.data?.synopsis || "N/A"}
                  variant="synopsis"
                />

                <MovieInfoCard
                  title="Gêneros"
                  value={movie.data?.genres || "N/A"}
                  variant="genres"
                />
              </div>
              <div className="flex flex-col gap-4 w-full lg:w-1/2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <MovieInfoCard
                    title="Lançamento"
                    value={
                      movie.data?.releaseDate
                        ? new Date(movie.data.releaseDate).toLocaleDateString(
                            "pt-BR"
                          )
                        : "N/A"
                    }
                  />

                  <MovieInfoCard
                    title="Duração"
                    value={movie.data?.duration || "N/A"}
                  />

                  <MovieInfoCard
                    title="Situação"
                    value={
                      movie.data?.status === "released"
                        ? "Lançado"
                        : movie.data?.status === "upcoming"
                        ? "Previsto"
                        : movie.data?.status === "in_production"
                        ? "Em produção"
                        : movie.data?.status === "cancelled"
                        ? "Cancelado"
                        : "N/A"
                    }
                  />

                  <MovieInfoCard
                    title="Idioma"
                    value={movie.data?.language || "N/A"}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <MovieInfoCard
                    title="Orçamento"
                    value={movie.data?.budget || "N/A"}
                  />

                  <MovieInfoCard
                    title="Receita"
                    value={movie.data?.revenue || "N/A"}
                  />

                  <MovieInfoCard
                    title="Lucro"
                    value={movie.data?.profit || "N/A"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 ">
        <p className="text-2xl font-bold mb-4">Trailer</p>
        {movie.data?.trailerUrl ? (
          <div className="relative w-full aspect-video rounded-sm overflow-hidden bg-black/40">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube.com/embed/${
                movie.data?.trailerUrl?.split("v=")[1]
              }`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <p>Não há trailer disponível.</p>
        )}
      </div>
    </div>
  );
}

function MovieInfoCard({
  title,
  value,
  variant = "default",
}: {
  title: string;
  value: string | string[];
  variant?: "default" | "synopsis" | "genres";
}) {
  return variant === "default" ? (
    <div className="flex flex-col gap-2 p-4 rounded-sm bg-mauve-dark-1/[0.7] backdrop-blur-sm">
      <p className="text-xs font-bold uppercase">{title}</p>
      <p className="font-bold text-sm">{value}</p>
    </div>
  ) : variant === "synopsis" ? (
    <div className="flex flex-col gap-2 p-4 rounded-sm bg-mauve-dark-1/[0.7] backdrop-blur-sm">
      <p className="font-bold uppercase">{title}</p>
      <p className="whitespace-pre-wrap overflow-y-auto max-h-[160px]">
        {value}
      </p>
    </div>
  ) : variant === "genres" ? (
    <div className="flex flex-col gap-2 p-4 rounded-sm bg-mauve-dark-1/[0.7] backdrop-blur-sm">
      <p className="text-xs font-bold uppercase">{title}</p>
      {Array.isArray(value) ? (
        <div className="flex flex-wrap gap-2">
          {value.map((genre) => (
            <p
              key={genre}
              className="text-sm bg-genre-card/20 text-primary-foreground px-2 py-1"
            >
              {genre}
            </p>
          ))}
        </div>
      ) : (
        <p>{value}</p>
      )}
    </div>
  ) : null;
}
