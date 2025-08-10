// default file for create and export types/inferfaces
import { type JwtPayload } from "jwt-decode";

export interface JwtSession extends JwtPayload {
  name: string;
}

export interface OmdbResponse {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: string;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

export type OmdbMinimal = {
  Released?: string;
  imdbRating?: string;
  imdbVotes?: string;
  imdbID?: string;
  Title?: string;
  Plot?: string;
  Poster?: string;
  Runtime?: string;
  Language?: string;
  Genre?: string;
  BoxOffice?: string;
};
