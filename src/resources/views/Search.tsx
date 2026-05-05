import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search as SearchIcon, Filter } from 'lucide-react';
import { searchMovies, getImageUrl } from '../../services/tmdb';
import { Link } from 'react-router-dom';

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const Search = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  const { data: movies, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchMovies(debouncedQuery),
    enabled: !!debouncedQuery,
  });

  return (
    <div className="pt-24 px-4 md:px-12 min-h-screen">
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for movies, TV shows, actors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-black/40 border border-white/10 rounded-full text-white hover:bg-black/60 transition-colors">
          <Filter size={20} />
          Filters
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {!isLoading && movies && movies.length === 0 && debouncedQuery && (
        <div className="text-center text-gray-400 py-12">
          No results found for "{debouncedQuery}"
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies?.map((movie) => (
          <Link
            to={`/movie/${movie.id}`}
            key={movie.id}
            className="relative aspect-[2/3] rounded-xl overflow-hidden group hover:scale-105 transition-transform"
          >
            <img
              src={getImageUrl(movie.poster_path, 'w500')}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
              <h3 className="text-white font-bold text-sm mb-1">{movie.title}</h3>
              <p className="text-green-400 text-xs font-semibold">{movie.vote_average.toFixed(1)} Rating</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Search;
