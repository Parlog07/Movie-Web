import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Plus, ThumbsUp } from 'lucide-react';
import { getMoviesByCategory, getImageUrl, Movie } from '../../services/tmdb';
import { motion } from 'framer-motion';

interface MovieRowProps {
  title: string;
  endpoint: string;
}

const MovieRow = ({ title, endpoint }: MovieRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  
  const { data: movies, isLoading } = useQuery({
    queryKey: ['movies', endpoint],
    queryFn: () => getMoviesByCategory(endpoint),
  });

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 py-4 px-4 md:px-12">
        <div className="h-6 w-32 bg-gray-800 rounded animate-pulse"></div>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="min-w-[200px] h-[300px] bg-gray-800 rounded-xl animate-pulse flex-shrink-0"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 px-4 md:px-12 relative group">
      <h2 className="text-white text-xl md:text-2xl font-bold mb-4">{title}</h2>
      
      <div className="relative">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-40 bg-black/50 hover:bg-black/80 w-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="text-white" size={32} />
        </button>

        <div 
          ref={rowRef}
          className="flex gap-4 overflow-x-scroll scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies?.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-40 bg-black/50 hover:bg-black/80 w-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="text-white" size={32} />
        </button>
      </div>
    </div>
  );
};

const MovieCard = ({ movie }: { movie: Movie }) => {
  return (
    <motion.div 
      className="relative min-w-[200px] h-[300px] rounded-xl overflow-hidden cursor-pointer group flex-shrink-0 block"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/movie/${movie.id}`} className="absolute inset-0 z-10" />
      <img 
        src={getImageUrl(movie.poster_path, 'w500')} 
        alt={movie.title}
        className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-50"
      />
      <div className="absolute inset-0 border border-white/10 rounded-xl group-hover:border-primary/50 transition-colors shadow-[0_0_0_rgba(139,92,246,0)] group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"></div>
      
      <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/90 via-black/40 to-transparent">
        <h3 className="text-white font-bold text-sm mb-2">{movie.title}</h3>
        <div className="flex items-center gap-2 mb-2 text-xs text-green-400 font-semibold">
          <span>{movie.vote_average.toFixed(1)} Rating</span>
          <span className="text-gray-300 border border-gray-600 px-1 rounded">HD</span>
        </div>
        <div className="flex gap-2">
          <button className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-200">
            <Play fill="currentColor" size={12} />
          </button>
          <button className="w-8 h-8 border border-gray-400 text-white rounded-full flex items-center justify-center hover:border-white">
            <Plus size={16} />
          </button>
          <button className="w-8 h-8 border border-gray-400 text-white rounded-full flex items-center justify-center hover:border-white ml-auto">
            <ThumbsUp size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieRow;
