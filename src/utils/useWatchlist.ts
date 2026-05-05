import { useState, useEffect } from 'react';

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<any[]>(() => {
    const saved = localStorage.getItem('parlog_watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('parlog_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = (movie: any) => {
    if (!watchlist.find(m => m.id === movie.id)) {
      setWatchlist([...watchlist, movie]);
    }
  };

  const removeFromWatchlist = (id: number) => {
    setWatchlist(watchlist.filter(m => m.id !== id));
  };

  const isInWatchlist = (id: number) => {
    return !!watchlist.find(m => m.id === id);
  };

  return { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist };
};
