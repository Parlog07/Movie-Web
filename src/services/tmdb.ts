import axios from 'axios';

/**
 * ------------------------------------------------------------------
 * FREE API SETUP INSTRUCTIONS: TMDB (The Movie Database)
 * ------------------------------------------------------------------
 * 1. How to get a free TMDB API key:
 *    - Go to https://www.themoviedb.org/ and create a free account.
 *    - Once logged in, go to your account settings.
 *    - Navigate to the "API" section from the left sidebar.
 *    - Click on "Create" or "Request an API Key" (choose Developer).
 *    - Fill out the required details. You will instantly receive an API Key (v3 auth).
 * 
 * 2. How to configure environment variables:
 *    - In the root of this project, create a file named `.env`.
 *    - Add your key like this:
 *      VITE_TMDB_API_KEY=your_api_key_here
 *    - Restart the development server if it's currently running.
 * 
 * 3. Rate limiting considerations:
 *    - TMDB currently enforces a rate limit of about 50 requests per second.
 *    - In this app, React Query (TanStack Query) handles caching, heavily 
 *      reducing unnecessary requests.
 *    - For search inputs, we use debouncing (e.g., using `useDebounce` hook) 
 *      so that an API call is only made after the user stops typing for 500ms,
 *      preventing rapid back-to-back requests.
 * ------------------------------------------------------------------
 */

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
// Fallback key provided for demonstration purposes only. Replace in production!
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '15d2ea6d0dc1d476efbca3eba2b9bbfb';

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
  runtime?: number;
  genres?: { id: number; name: string }[];
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

export const getImageUrl = (path: string | null, size: 'w500' | 'original' = 'original') => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
