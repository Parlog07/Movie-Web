import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, User } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300 ease-in-out px-4 md:px-8 py-4 flex items-center justify-between',
        isScrolled
          ? 'glass border-b-primary shadow-[0_4px_30px_rgba(139,92,246,0.1)]'
          : 'bg-transparent'
      )}
    >
      <div className="flex items-center gap-8">
        <Link to="/" className="text-2xl font-bold tracking-tighter text-white flex items-center gap-1 text-shadow-md">
          PARLOG<span className="text-primary">VIEW</span>
        </Link>
        <div className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-300">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/series" className="hover:text-white transition-colors">TV Shows</Link>
          <Link to="/movies" className="hover:text-white transition-colors">Movies</Link>
          <Link to="/new" className="hover:text-white transition-colors">New & Popular</Link>
          <Link to="/list" className="hover:text-white transition-colors">My List</Link>
        </div>
      </div>

      <div className="flex items-center gap-4 text-white">
        <Link to="/search" className="hover:text-primary transition-colors">
          <Search size={20} />
        </Link>
        <button className="hover:text-primary transition-colors">
          <Bell size={20} />
        </button>
        <button className="w-8 h-8 rounded-md bg-gradient-to-tr from-primary to-accent flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-[0_0_15px_rgba(139,92,246,0.5)]">
          <User size={16} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
