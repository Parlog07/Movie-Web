import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, User, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'TV Shows', path: '/series' },
    { name: 'Movies', path: '/movies' },
    { name: 'New & Popular', path: '/new' },
    { name: 'My List', path: '/list' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300 ease-in-out px-4 md:px-8 py-4 flex items-center justify-between',
        isScrolled || isMobileMenuOpen
          ? 'glass border-b-primary shadow-[0_4px_30px_rgba(139,92,246,0.1)] bg-background/90 backdrop-blur-md'
          : 'bg-transparent'
      )}
    >
      <div className="flex items-center gap-4 md:gap-8">
        <button 
          className="md:hidden text-white hover:text-primary transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <Link to="/" className="text-2xl font-bold tracking-tighter text-white flex items-center gap-1 text-shadow-md">
          PARLOG<span className="text-primary">VIEW</span>
        </Link>
        <div className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-300">
          {navLinks.map(link => (
            <Link key={link.name} to={link.path} className="hover:text-white transition-colors">
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 text-white">
        <Link to="/search" className="hover:text-primary transition-colors">
          <Search size={20} />
        </Link>
        <button className="hover:text-primary transition-colors hidden sm:block">
          <Bell size={20} />
        </button>
        <button className="w-8 h-8 rounded-md bg-gradient-to-tr from-primary to-accent flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-[0_0_15px_rgba(139,92,246,0.5)]">
          <User size={16} />
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={cn(
        'absolute top-full left-0 w-full bg-background/95 backdrop-blur-lg border-b border-white/10 md:hidden transition-all duration-300 ease-in-out overflow-hidden',
        isMobileMenuOpen ? 'max-h-64 py-4' : 'max-h-0 py-0 border-transparent'
      )}>
        <div className="flex flex-col gap-4 px-4 font-medium text-gray-300">
          {navLinks.map(link => (
            <Link key={link.name} to={link.path} className="hover:text-white transition-colors block">
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
