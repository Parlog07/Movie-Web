import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Play, Plus, Check, ChevronDown } from 'lucide-react';
import { getTvShowDetails, getSeasonEpisodes, getImageUrl } from '../../services/tmdb';
import { useWatchlist } from '../../utils/useWatchlist';
import { useState, useEffect } from 'react';

const SERVERS = [
  { name: 'AutoEmbed', url: (tmdb: string | number, s: number, e: number) => `https://autoembed.co/tv/tmdb/${tmdb}-${s}-${e}` },
  { name: 'VidLink (HD)', url: (tmdb: string | number, s: number, e: number) => `https://vidlink.pro/tv/${tmdb}/${s}/${e}` },
  { name: 'SmashyStream', url: (tmdb: string | number, s: number, e: number) => `https://player.smashy.stream/tv?tmdb=${tmdb}&season=${s}&episode=${e}` },
  { name: 'VidSrc', url: (tmdb: string | number, s: number, e: number) => `https://vidsrc.to/embed/tv/${tmdb}/${s}/${e}?ds_lang=en` },
  { name: 'VidSrc ME', url: (tmdb: string | number, s: number, e: number) => `https://vidsrc.me/embed/tv?tmdb=${tmdb}&season=${s}&episode=${e}&ds_lang=en` },
  { name: 'VidSrc RU', url: (tmdb: string | number, s: number, e: number) => `https://vidsrc-embed.ru/embed/tv?tmdb=${tmdb}&season=${s}&episode=${e}&ds_lang=en` },
  { name: '2Embed', url: (tmdb: string | number, s: number, e: number) => `https://www.2embed.cc/embedtv/${tmdb}&s=${s}&e=${e}` }
];

const SeriesDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeServer, setActiveServer] = useState(SERVERS[0]);
  
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  const { data: show, isLoading: isShowLoading } = useQuery({
    queryKey: ['tv', id],
    queryFn: () => getTvShowDetails(id as string),
    enabled: !!id,
  });

  const { data: seasonData, isLoading: isSeasonLoading } = useQuery({
    queryKey: ['season', id, selectedSeason],
    queryFn: () => getSeasonEpisodes(id as string, selectedSeason),
    enabled: !!id && !!selectedSeason,
  });

  useEffect(() => {
    // Reset episode when season changes
    setSelectedEpisode(1);
  }, [selectedSeason]);

  if (isShowLoading || !show) {
    return (
      <div className="w-full h-screen bg-background animate-pulse flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const creator = show.created_by?.[0]?.name;
  const cast = show.credits?.cast?.slice(0, 6) || [];
  const similarShows = show.similar?.results?.slice(0, 6) || [];
  const inList = isInWatchlist(show.id);
  
  // Filter out season 0 (Specials) for simplicity unless you specifically want them
  const seasons = show.seasons?.filter((s: any) => s.season_number > 0) || [];
  const episodes = seasonData?.episodes || [];

  const handleListToggle = () => {
    if (inList) removeFromWatchlist(show.id);
    else addToWatchlist(show);
  };

  const handlePlayEpisode = (episodeNumber: number) => {
    setSelectedEpisode(episodeNumber);
    setIsPlaying(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-white pb-24">
      {/* Hero / Player Area */}
      <div className="relative w-full h-[60vh] md:h-[80vh]">
        {!isPlaying ? (
          <>
            <img
              src={getImageUrl(show.backdrop_path, 'original')}
              alt={show.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 flex flex-col gap-6">
              <h1 className="text-4xl md:text-6xl font-bold text-shadow-md">{show.name}</h1>
              
              <div className="flex items-center gap-4 text-sm md:text-base font-semibold text-gray-300">
                <span className="text-green-400">{show.vote_average.toFixed(1)} Rating</span>
                <span>{show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'Unknown'}</span>
                <span>{show.number_of_seasons} Seasons</span>
                <span className="border border-gray-600 px-2 rounded">HD</span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button 
                  onClick={() => setIsPlaying(true)}
                  className="flex items-center gap-2 px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Play fill="currentColor" size={20} />
                  Play S{selectedSeason} E{selectedEpisode}
                </button>
                <button 
                  onClick={handleListToggle}
                  className="flex items-center gap-2 px-6 py-3 bg-black/50 border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm"
                >
                  {inList ? <Check size={20} /> : <Plus size={20} />}
                  {inList ? 'My List' : 'Add to List'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col bg-black">
            <div className="w-full flex-grow relative">
              <iframe 
                src={activeServer.url(show.id, selectedSeason, selectedEpisode)}
                className="w-full h-full border-none absolute inset-0"
                allowFullScreen
                referrerPolicy="origin"
                allow="autoplay; fullscreen"
                title={`${show.name} - S${selectedSeason} E${selectedEpisode}`}
              ></iframe>
            </div>
            
            {/* Player Controls Bar */}
            <div className="w-full bg-background p-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsPlaying(false)}
                  className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-full transition-colors flex items-center gap-2 font-semibold text-sm"
                >
                  Close Player
                </button>
                
                {/* Minimal TV info in player bar */}
                <div className="hidden md:flex items-center gap-2 text-gray-300 font-medium">
                  <span className="text-white">{show.name}</span>
                  <span>&bull;</span>
                  <span>S{selectedSeason} E{selectedEpisode}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 overflow-x-auto pb-2 sm:pb-0">
                <span className="text-gray-400 text-sm font-medium whitespace-nowrap">Servers:</span>
                <div className="flex bg-black/50 rounded-full p-1 border border-white/10">
                  {SERVERS.map((server) => (
                    <button
                      key={server.name}
                      onClick={() => setActiveServer(server)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                        activeServer.name === server.name 
                          ? 'bg-primary text-white shadow-lg' 
                          : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {server.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Details & Episodes Grid */}
      <div className="px-8 md:px-16 pt-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Episode Selection Section */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
              <h2 className="text-2xl font-bold">Episodes</h2>
              
              <div className="relative">
                <select 
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(Number(e.target.value))}
                  className="appearance-none bg-black/50 border border-white/20 text-white font-medium py-2 pl-4 pr-10 rounded-lg outline-none focus:border-primary transition-colors cursor-pointer"
                >
                  {seasons.map((s: any) => (
                    <option key={s.season_number} value={s.season_number}>
                      Season {s.season_number}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {isSeasonLoading ? (
                <div className="text-center py-8 text-gray-500 animate-pulse">Loading episodes...</div>
              ) : episodes.length > 0 ? (
                episodes.map((ep: any) => (
                  <div 
                    key={ep.id}
                    onClick={() => handlePlayEpisode(ep.episode_number)}
                    className={`flex flex-col sm:flex-row gap-4 p-3 rounded-xl cursor-pointer transition-all ${selectedEpisode === ep.episode_number && isPlaying ? 'bg-primary/20 border-primary/50 border' : 'hover:bg-white/10 border border-transparent'}`}
                  >
                    <div className="relative w-full sm:w-40 aspect-video rounded-lg overflow-hidden shrink-0 bg-gray-900">
                      <img 
                        src={getImageUrl(ep.still_path, 'w500')} 
                        alt={ep.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors">
                        <Play size={24} className="text-white drop-shadow-md" />
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-white text-lg">{ep.episode_number}. {ep.name}</h4>
                        <span className="text-sm font-medium text-gray-400 shrink-0 ml-2">{ep.runtime}m</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-3 leading-relaxed">{ep.overview || "No overview available."}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">No episodes found for this season.</div>
              )}
            </div>
          </div>

          <p className="text-lg text-gray-300 leading-relaxed">
            {show.overview}
          </p>

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

        <div className="space-y-6 text-sm bg-white/5 p-6 rounded-2xl border border-white/10 h-fit">
          <div>
            <span className="text-gray-500 block mb-1">Creator</span>
            <span className="text-gray-200">{creator || 'Unknown'}</span>
          </div>
          <div>
            <span className="text-gray-500 block mb-1">Genres</span>
            <span className="text-gray-200">
              {show.genres?.map((g: any) => g.name).join(', ')}
            </span>
          </div>
          <div>
            <span className="text-gray-500 block mb-1">First Air Date</span>
            <span className="text-gray-200">{show.first_air_date}</span>
          </div>
          <div>
            <span className="text-gray-500 block mb-1">Status</span>
            <span className="text-green-400 font-medium">{show.status}</span>
          </div>
        </div>
      </div>

      {/* Similar Shows */}
      {similarShows.length > 0 && (
        <div className="px-8 md:px-16 mt-16">
          <h2 className="text-2xl font-bold mb-6">Similar TV Shows</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {similarShows.map((sm: any) => (
              <Link
                to={`/series/${sm.id}`}
                key={sm.id}
                className="relative aspect-[2/3] rounded-xl overflow-hidden group hover:scale-105 transition-transform"
              >
                <img
                  src={getImageUrl(sm.poster_path, 'w500')}
                  alt={sm.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold text-sm mb-1">{sm.name}</h3>
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

export default SeriesDetail;
