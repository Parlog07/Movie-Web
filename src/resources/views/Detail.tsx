import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Play, Plus, Check, Share2, Star } from 'lucide-react';
import { getMovieDetails, getImageUrl } from '../../services/tmdb';
import { useWatchlist } from '../../utils/useWatchlist';
import { useState } from 'react';

const Detail = () => {
  const { id } = useParams<{ id: string }>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  const { data: movie, isLoading } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => getMovieDetails(id as string),
    enabled: !!id,
  });

  if (isLoading || !movie) {
    return (
      <div className="w-full h-screen bg-background animate-pulse flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const director = movie.credits?.crew?.find((c: any) => c.job === 'Director')?.name;
  const cast = movie.credits?.cast?.slice(0, 6) || [];
  const similarMovies = movie.similar?.results?.slice(0, 6) || [];
  const inList = isInWatchlist(movie.id);

  const handleListToggle = () => {
    if (inList) removeFromWatchlist(movie.id);
    else addToWatchlist(movie);
  };

  return (
    <div className="min-h-screen bg-background text-white pb-24">
      {/* Hero / Player Area */}
      <div className="relative w-full h-[60vh] md:h-[80vh]">
        {!isPlaying ? (
          <>
            <img
              src={getImageUrl(movie.backdrop_path, 'original')}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 flex flex-col gap-6">
              <h1 className="text-4xl md:text-6xl font-bold text-shadow-md">{movie.title}</h1>
              
              <div className="flex items-center gap-4 text-sm md:text-base font-semibold text-gray-300">
                <span className="text-green-400">{movie.vote_average.toFixed(1)} Rating</span>
                <span>{new Date(movie.release_date).getFullYear()}</span>
                <span>{movie.runtime} min</span>
                <span className="border border-gray-600 px-2 rounded">HD</span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button 
                  onClick={() => setIsPlaying(true)}
                  className="flex items-center gap-2 px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Play fill="currentColor" size={20} />
                  Play
                </button>
                <button 
                  onClick={handleListToggle}
                  className="flex items-center gap-2 px-6 py-3 bg-black/50 border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm"
                >
                  {inList ? <Check size={20} /> : <Plus size={20} />}
                  {inList ? 'My List' : 'Add to List'}
                </button>
                <button className="w-12 h-12 flex items-center justify-center rounded-full bg-black/50 border border-white/20 hover:bg-white/10 transition-colors backdrop-blur-sm">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-black relative flex flex-col justify-center items-center">
            {/* Custom Video Player Placeholder */}
            <video 
              controls
              className="w-full h-full object-contain"
              poster={getImageUrl(movie.backdrop_path, 'original')}
            >
              <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              Your browser does not support HTML5 video.
            </video>
            <button 
              onClick={() => setIsPlaying(false)}
              className="absolute top-24 left-8 bg-black/50 hover:bg-black/80 text-white px-4 py-2 rounded-full backdrop-blur-md"
            >
              Close Player
            </button>
          </div>
        )}
      </div>

      {/* Details Grid */}
      <div className="px-8 md:px-16 pt-8 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
          <p className="text-lg text-gray-300 leading-relaxed">
            {movie.overview}
          </p>

          <div>
            <h3 className="text-xl font-bold mb-4">Rate this movie</h3>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star}
                  onClick={() => setUserRating(star)}
                  className={`transition-colors ${star <= userRating ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400/50'}`}
                >
                  <Star fill={star <= userRating ? "currentColor" : "none"} size={28} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Cast</h3>
            <div className="flex flex-wrap gap-4">
              {cast.map((actor: any) => (
                <div key={actor.id} className="flex items-center gap-3 bg-white/5 rounded-full pr-4 p-1">
                  <img 
                    src={getImageUrl(actor.profile_path, 'w500')} 
                    alt={actor.name}
                    className="w-10 h-10 rounded-full object-cover bg-gray-800"
                  />
                  <span className="text-sm font-medium">{actor.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 text-sm">
          <div>
            <span className="text-gray-500 block mb-1">Director</span>
            <span className="text-gray-200">{director || 'Unknown'}</span>
          </div>
          <div>
            <span className="text-gray-500 block mb-1">Genres</span>
            <span className="text-gray-200">
              {movie.genres?.map((g: any) => g.name).join(', ')}
            </span>
          </div>
          <div>
            <span className="text-gray-500 block mb-1">Release Date</span>
            <span className="text-gray-200">{movie.release_date}</span>
          </div>
        </div>
      </div>

      {/* Similar Movies */}
      {similarMovies.length > 0 && (
        <div className="px-8 md:px-16 mt-16">
          <h2 className="text-2xl font-bold mb-6">Similar Movies</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {similarMovies.map((sm: any) => (
              <Link
                to={`/movie/${sm.id}`}
                key={sm.id}
                className="relative aspect-[2/3] rounded-xl overflow-hidden group hover:scale-105 transition-transform"
              >
                <img
                  src={getImageUrl(sm.poster_path, 'w500')}
                  alt={sm.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold text-sm mb-1">{sm.title}</h3>
                  <p className="text-green-400 text-xs font-semibold">{sm.vote_average.toFixed(1)} Rating</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Detail;
