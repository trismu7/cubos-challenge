"use client";

import { Input } from "@/components/ui/input";
import AddMovieSheet from "@/components/movie/AddMovieSheet";
import { useEffect, useMemo, useRef, useState } from "react";
import { getUserMovies } from "@/lib/actions/movie/read/getUserMovies";
import { Movie } from "@prisma/client";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2,
  SearchIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FiltersDialog from "@/components/FiltersDialog";
import { getSearchResults } from "@/lib/actions/movie/read/getSearchResults";
import { SearchFilters } from "@/lib/formSchemas/searchFiltersSchema";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Main() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [updateMovies, setUpdateMovies] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Movie[] | null>(null);
  const [filters, setFilters] = useState<SearchFilters | null>(null);
  const debounceRef = useRef<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(14);

  useEffect(() => {
    async function fetchMovies() {
      const { data, success, message } = await getUserMovies();
      if (data) setMovies(data);
      if (!success) setError(message);
      setIsLoading(false);
    }

    fetchMovies();
  }, [updateMovies]);

  // parse duration string to minutes if stored like "120 min" or "1h 30m"
  const parseDurationToMinutes = (duration: string): number | null => {
    if (!duration) return null;
    const minMatch = duration.match(/(\d+)\s*min/);
    const hMatch = duration.match(/(\d+)\s*h/);
    const mMatch = duration.match(/(\d+)\s*m(?!in)/);
    if (minMatch) return parseInt(minMatch[1], 10);
    if (hMatch || mMatch) {
      const h = hMatch ? parseInt(hMatch[1], 10) : 0;
      const m = mMatch ? parseInt(mMatch[1], 10) : 0;
      return h * 60 + m;
    }
    const numeric = parseInt(duration, 10);
    return isNaN(numeric) ? null : numeric;
  };

  const visibleMovies = useMemo(() => {
    const base = (searchResults ?? movies) as Movie[];
    if (!filters) return base;
    return base.filter((mv) => {
      // release date filtering
      if (filters.releaseStart && mv.releaseDate) {
        if (new Date(mv.releaseDate) < filters.releaseStart) return false;
      }
      if (filters.releaseEnd && mv.releaseDate) {
        if (new Date(mv.releaseDate) > filters.releaseEnd) return false;
      }
      // duration filtering (minutes)
      const mins = parseDurationToMinutes(mv.duration);
      if (filters.durationMin !== undefined && mins !== null) {
        if (mins < filters.durationMin) return false;
      }
      if (filters.durationMax !== undefined && mins !== null) {
        if (mins > filters.durationMax) return false;
      }

      // imdb rating filtering
      if (filters.imdbRatingMin !== undefined && mv.imdbRating) {
        if (Number(mv.imdbRating) < filters.imdbRatingMin) return false;
      }
      if (filters.imdbRatingMax !== undefined && mv.imdbRating) {
        if (Number(mv.imdbRating) > filters.imdbRatingMax) return false;
      }

      // imdb votes filtering
      if (filters.imdbVotesMin !== undefined && mv.imdbVotes) {
        if (Number(mv.imdbVotes) < filters.imdbVotesMin) return false;
      }
      if (filters.imdbVotesMax !== undefined && mv.imdbVotes) {
        if (Number(mv.imdbVotes) > filters.imdbVotesMax) return false;
      }
      return true;
    });
  }, [movies, searchResults, filters]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(visibleMovies.length / pageSize));
  }, [pageSize, visibleMovies.length]);

  const pagedMovies = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return visibleMovies.slice(start, start + pageSize);
  }, [visibleMovies, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, filters, searchResults]);

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (value.trim() === "") {
      setSearchResults(null);
      return;
    }
    debounceRef.current = window.setTimeout(async () => {
      setIsSearching(true);
      const res = await getSearchResults(value.trim());
      if (res.success && res.data) setSearchResults(res.data as Movie[]);
      else setSearchResults([]);
      setIsSearching(false);
    }, 1000); // debounce delay 1s
  };

  const handleApplyFilters = (f: SearchFilters) => {
    setFilters(f);
  };

  const handleClearFilters = () => {
    setFilters(null);
  };

  return (
    <div className="p-6 flex flex-col gap-4 min-h-[calc(100vh-130px)]">
      {/* search bar */}
      <div className="flex-col md:flex-row flex items-center justify-end gap-[10px] lg:w-1/2 md:ml-auto">
        <div className="relative w-full">
          <Input
            className="bg-input h-10 peer pe-9"
            placeholder="Pesquise por filmes"
            value={keyword}
            onChange={(e) => handleKeywordChange(e.target.value)}
          />

          {isSearching && (
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          )}

          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
            <SearchIcon size={16} aria-hidden="true" />
          </div>
        </div>

        <div className="flex gap-4 w-full md:w-auto max-[400px]:grid">
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => setPageSize(Number(value))}
          >
            <SelectTrigger className="bg-secondary cursor-pointer hover:bg-secondary/80 rounded-sm px-2 text-sm max-[400px]:w-full">
              <SelectValue placeholder="Itens por página" />
            </SelectTrigger>
            <SelectContent className="bg-input cursor-pointer">
              <SelectItem value="10">10 itens por página</SelectItem>
              <SelectItem value="14">14 itens por página</SelectItem>
              {/* 1920x1080 */}
              <SelectItem value="16">16 itens por página</SelectItem>
              <SelectItem value="18">18 itens por página</SelectItem>
              <SelectItem value="20">20 itens por página</SelectItem>
            </SelectContent>
          </Select>
          <FiltersDialog
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
          />
          <AddMovieSheet onAddMovie={() => setUpdateMovies((prev) => !prev)} />
        </div>
      </div>

      {/* movies list */}
      <div className="p-6 grid grid-cols-2 md:flex flex-wrap gap-6 bg-white/[0.08] rounded-sm backdrop-blur-sm">
        {error ? (
          <div className="grid place-items-center h-full min-w-sm">
            Não foi possível carregar seus filmes.
          </div>
        ) : isLoading || isSearching ? (
          <div className="grid place-items-center h-full w-screen">
            <Loader2 className="w-20 h-20 animate-spin" />
          </div>
        ) : (
          pagedMovies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        )}

        {!error && !isLoading && !isSearching && visibleMovies.length === 0 && (
          <div className="grid place-items-center h-full">
            Nenhum filme encontrado.
          </div>
        )}
      </div>

      {/* Pagination */}
      {visibleMovies.length > pageSize && (
        <div className="flex items-center justify-center gap-4 py-6">
          <Button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`h-12 w-16 rounded-sm ${
              currentPage === 1
                ? "bg-[#2a2a2c] text-gray-400 cursor-not-allowed"
                : ""
            }`}
            aria-label="Página anterior"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            const isActive = pageNum === currentPage;
            return (
              <Button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                disabled={isActive}
                className={`h-12 w-12 rounded-sm font-medium ${
                  isActive
                    ? "bg-[#2a2a2c] text-gray-300 cursor-default"
                    : "bg-purple-9 text-white hover:bg-purple-10"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {pageNum}
              </Button>
            );
          })}

          <Button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`h-12 w-16 rounded-sm ${
              currentPage === totalPages
                ? "bg-[#2a2a2c] text-gray-400 cursor-not-allowed"
                : ""
            }`}
            aria-label="Próxima página"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function MovieCard({ movie }: { movie: Movie }) {
  const watchedPercentage = movie.watchedPercentage || 0;
  const genres = Array.isArray(movie.genres)
    ? movie.genres.join(", ")
    : movie.genres || "";

  return (
    <Link href={`/main/movie/${movie.id}`}>
      <div className="group relative aspect-[3/4] w-full md:h-[355px] md:w-[235px] overflow-hidden rounded-sm cursor-pointer transition-transform duration-300 hover:scale-105">
        {/* Movie Poster */}
        <Image
          src={movie.imageUrl}
          alt={movie.title}
          fill
          sizes="(min-width: 768px) 235px, 50vw"
          priority
          quality={100}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Overlay*/}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-between pt-4 pb-12 px-4 lg:pb-4">
          {/* Top section with progress circle */}
          <div className="lg:flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-100 lg:pt-16">
            <div className="relative w-30 h-30 rounded-full backdrop-blur-sm">
              {/* Background circle */}
              <svg
                className="w-30 h-30 transform -rotate-90"
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
                    2 * Math.PI * 32 * (1 - watchedPercentage / 100)
                  }`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {watchedPercentage}%
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 lg:translate-y-6 lg:group-hover:translate-y-0 transition-transform duration-300 z-10">
            <h2 className="text-white text-lg max-md:text-sm lg:text-xl font-bold leading-tight line-clamp-2 break-words">
              {movie.title}
            </h2>

            <p className="max-[390px]:hidden text-gray-300 text-sm leading-snug line-clamp-1 md:line-clamp-2 break-words opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 delay-100">
              {genres}
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/100 to-transparent lg:group-hover:opacity-0 transition-opacity duration-300" />
      </div>
    </Link>
  );
}
