import axios from 'axios';


const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '15d2ea6d0dc1d476efbca3eba2b9bbfb';

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export interface Movie {
  id: number;
  tmdb_id?: number;
  title?: string;
  name?: string; // For TV Shows
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string; // For TV Shows
  genre_ids: number[];
  runtime?: number;
  genres?: { id: number; name: string }[];
  seasons?: { season_number: number; episode_count: number; name: string; overview: string }[]; // For TV Shows
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export const getTrendingMovies = async (): Promise<Movie[]> => {
  const { data } = await tmdbApi.get<PaginatedResponse<Movie>>('/trending/movie/day');
  return data.results;
};

export const getMoviesByCategory = async (endpoint: string): Promise<Movie[]> => {
  const { data } = await tmdbApi.get<PaginatedResponse<Movie>>(endpoint);
  return data.results;
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  if (!query) return [];
  const { data } = await tmdbApi.get<PaginatedResponse<Movie>>('/search/movie', {
    params: { query },
  });
  return data.results;
};

export const getMovieDetails = async (id: string): Promise<any> => {
  const { data } = await tmdbApi.get<any>(`/movie/${id}`, {
    params: { append_to_response: 'credits,similar' }
  });
  return data;
};

export const getTvShowDetails = async (id: string): Promise<any> => {
  const { data } = await tmdbApi.get<any>(`/tv/${id}`, {
    params: { append_to_response: 'credits,similar' }
  });
  return data;
};

export const getSeasonEpisodes = async (tvId: string, seasonNumber: number): Promise<any> => {
  const { data } = await tmdbApi.get<any>(`/tv/${tvId}/season/${seasonNumber}`);
  return data;
};

export const getTmdbIdByImdb = async (imdbId: string): Promise<number | null> => {
  try {
    const { data } = await tmdbApi.get<any>(`/find/${imdbId}`, {
      params: { external_source: 'imdb_id' }
    });
    if (data.tv_results && data.tv_results.length > 0) {
      return data.tv_results[0].id;
    }
    return null;
  } catch (error) {
    console.error('Error fetching TMDB ID by IMDb ID:', error);
    return null;
  }
};

export const getImageUrl = (path: string | null, size: 'w500' | 'original' = 'original') => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  if (path.startsWith('http')) return path;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
