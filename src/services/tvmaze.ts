import axios from 'axios';
import { getTmdbIdByImdb, type Movie } from './tmdb';

const TVMAZE_BASE_URL = 'https://api.tvmaze.com';

const tvMazeApi = axios.create({
  baseURL: TVMAZE_BASE_URL,
});

export interface TvMazeShow {
  id: number;
  name: string;
  summary: string;
  image?: {
    medium: string;
    original: string;
  };
  rating?: {
    average: number;
  };
  genres?: string[];
  premiered?: string;
  status?: string;
  network?: { name: string };
  webChannel?: { name: string };
  externals?: {
    themoviedb?: number;
    tvrage?: number;
    thetvdb?: number;
    imdb?: string;
  };
  _embedded?: {
    cast?: Array<{ person: { id: number, name: string, image?: { original: string, medium: string } } }>;
    episodes?: Array<{ id: number, name: string, season: number, number: number, airdate: string, runtime: number, image?: { original: string }, summary: string }>;
  };
}

const mapShowToMovie = (show: TvMazeShow): Movie => {
  const overview = show.summary ? show.summary.replace(/<[^>]+>/g, '') : 'No overview available.';
  
  return {
    id: show.id,
    name: show.name,
    title: show.name,
    overview,
    poster_path: show.image?.original || show.image?.medium || null,
    backdrop_path: show.image?.original || null,
    vote_average: show.rating?.average || 0,
    first_air_date: show.premiered,
    genre_ids: [],
    genres: show.genres ? show.genres.map((g, i) => ({ id: i, name: g })) : [],
  };
};

export const getTvMazeShows = async (page: number = 0): Promise<Movie[]> => {
  try {
    const { data } = await tvMazeApi.get<TvMazeShow[]>(`/shows?page=${page}`);
    return data.map(mapShowToMovie);
  } catch (error) {
    console.error('Error fetching TVMaze shows:', error);
    return [];
  }
};

export const searchTvMazeShows = async (query: string): Promise<Movie[]> => {
  if (!query) return [];
  try {
    const { data } = await tvMazeApi.get<{ score: number; show: TvMazeShow }[]>('/search/shows', {
      params: { q: query },
    });
    return data.map((item) => mapShowToMovie(item.show));
  } catch (error) {
    console.error('Error searching TVMaze shows:', error);
    return [];
  }
};

export const getTrendingTvShows = async (): Promise<Movie[]> => {
  const shows = await getTvMazeShows(0);
  return shows
    .filter(show => show.vote_average > 8)
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 20);
};

export const getTvShowsByGenre = async (genre: string): Promise<Movie[]> => {
  const shows = await getTvMazeShows(0);
  return shows
    .filter(show => show.genres?.some(g => g.name.toLowerCase() === genre.toLowerCase()))
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 20);
};

export const getTopRatedTvShows = async (): Promise<Movie[]> => {
  const shows0 = await getTvMazeShows(0);
  const shows1 = await getTvMazeShows(1);
  const allShows = [...shows0, ...shows1];
  
  return allShows
    .filter(show => show.vote_average > 8.5)
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 20);
};

// Added for SeriesDetail
export const getTvMazeShowDetails = async (id: string): Promise<any> => {
  try {
    const { data } = await tvMazeApi.get<TvMazeShow>(`/shows/${id}?embed[]=cast&embed[]=episodes`);
    
    const overview = data.summary ? data.summary.replace(/<[^>]+>/g, '') : 'No overview available.';
    
    // Extract seasons from episodes
    const episodes = data._embedded?.episodes || [];
    const seasonNumbers = Array.from(new Set(episodes.map(e => e.season)));
    const seasons = seasonNumbers.map(s => ({ season_number: s }));
    
    let tmdb_id = data.externals?.themoviedb;
    if (!tmdb_id && data.externals?.imdb) {
      tmdb_id = await getTmdbIdByImdb(data.externals.imdb) || undefined;
    }
    
    return {
      id: data.id,
      tmdb_id: tmdb_id,
      name: data.name,
      overview,
      backdrop_path: data.image?.original || data.image?.medium || null,
      poster_path: data.image?.original || data.image?.medium || null,
      vote_average: data.rating?.average || 0,
      first_air_date: data.premiered,
      status: data.status,
      number_of_seasons: seasonNumbers.length,
      created_by: [{ name: data.network?.name || data.webChannel?.name || 'Unknown Network' }],
      genres: data.genres ? data.genres.map((g, i) => ({ id: i, name: g })) : [],
      seasons,
      credits: {
        cast: (data._embedded?.cast || []).slice(0, 10).map(c => ({
          id: c.person.id,
          name: c.person.name,
          profile_path: c.person.image?.medium || c.person.image?.original || null
        }))
      },
      similar: { results: [] } // TVMaze doesn't have a direct "similar" endpoint for shows without extra requests
    };
  } catch (error) {
    console.error('Error fetching TVMaze show details:', error);
    throw error;
  }
};

export const getTvMazeSeasonEpisodes = async (id: string, seasonNumber: number): Promise<any> => {
  try {
    const { data } = await tvMazeApi.get<any[]>(`/shows/${id}/episodes`);
    const seasonEpisodes = data.filter(e => e.season === seasonNumber);
    
    return {
      episodes: seasonEpisodes.map(ep => ({
        id: ep.id,
        episode_number: ep.number,
        name: ep.name,
        runtime: ep.runtime || 0,
        overview: ep.summary ? ep.summary.replace(/<[^>]+>/g, '') : 'No overview available.',
        still_path: ep.image?.original || ep.image?.medium || null
      }))
    };
  } catch (error) {
    console.error('Error fetching TVMaze season episodes:', error);
    throw error;
  }
};
