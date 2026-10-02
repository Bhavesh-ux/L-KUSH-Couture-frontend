
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Heart,
  ShoppingBag,
  Bell,
  User,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import logoImg from '../../assets/logo.jpg';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';
import { formatPrice } from '../../utils/formatters';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { itemCount, setIsCartDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { unreadCount } = useNotifications();
  const { customer, isAuthenticated, logoutCustomer } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);

  // Handle sticky blur on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Live search debounced query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      const results = await productService.getProducts({
        search: searchQuery
      });

      setSearchResults(results.slice(0, 5));
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Sherwanis', path: '/category/sherwani' },
    { label: 'Indo-Western', path: '/category/indo-western' },
    { label: 'Kurtas', path: '/category/kurta-pajama' },
    { label: 'Trending', path: '/trending' },
    { label: 'Curated', path: '/recommendations' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">

      {/* Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-luxury-black/95 backdrop-blur-md text-white shadow-xl py-2.5 border-b border-luxury-gold-500/20'
            : 'bg-luxury-black text-white py-3.5 border-b border-neutral-800'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Mobile Menu Trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 text-luxury-cream-100 hover:text-luxury-gold-400"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <button
              onClick={() => setSearchOpen(true)}
              className="p-1.5 ml-2 text-luxury-cream-100 hover:text-luxury-gold-400"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Left Nav Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.slice(0, 4).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs uppercase font-medium tracking-widest transition-colors ${
                  location.pathname === link.path
                    ? 'text-luxury-gold-400 font-bold border-b border-luxury-gold-400 pb-0.5'
                    : 'text-neutral-300 hover:text-luxury-gold-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Centered Brand Logo */}
          <Link
            to="/"
            className="flex flex-col items-center justify-center shrink-0 group"
          >
            <img
              src={logoImg}
              alt="L-KUSH Couture"
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Right Nav Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.slice(4).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs uppercase font-medium tracking-widest transition-colors ${
                  location.pathname === link.path
                    ? 'text-luxury-gold-400 font-bold border-b border-luxury-gold-400 pb-0.5'
                    : 'text-neutral-300 hover:text-luxury-gold-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Header Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4">

            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden lg:flex p-1.5 text-neutral-300 hover:text-luxury-gold-400 transition-colors"
              aria-label="Search Collection"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-1.5 text-neutral-300 hover:text-luxury-gold-400 transition-colors"
              aria-label="View Wishlist"
            >
              <Heart className="w-5 h-5" />

              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-luxury-gold-500 text-luxury-black text-[10px] font-extrabold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-1.5 text-neutral-300 hover:text-luxury-gold-400 transition-colors"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />

              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-luxury-gold-500 text-luxury-black text-[10px] font-extrabold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Notifications */}
            <Link
              to="/notifications"
              className="relative p-1.5 text-neutral-300 hover:text-luxury-gold-400 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />

              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* Customer Profile / Sign In */}
            <div className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 text-neutral-300 hover:text-luxury-gold-400 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-luxury-gold-500 text-luxury-black font-bold text-xs flex items-center justify-center">
                    {customer?.name?.charAt(0) || 'U'}
                  </div>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="p-1.5 text-neutral-300 hover:text-luxury-gold-400 transition-colors"
                  aria-label="Customer Sign In"
                >
                  <User className="w-5 h-5" />
                </Link>
              )}

              {/* User Dropdown Menu */}
              {userDropdownOpen && isAuthenticated && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 shadow-xl py-2 text-neutral-900 z-50 animate-in fade-in zoom-in-95">

                  <div className="px-4 py-2 border-b border-neutral-100">
                    <p className="text-xs font-bold text-neutral-900 truncate">
                      {customer?.name}
                    </p>

                    <p className="text-[11px] text-neutral-500 truncate">
                      {customer?.email}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-xs text-neutral-700 hover:bg-luxury-cream-100 hover:text-luxury-gold-700 font-medium"
                  >
                    My Profile & Measurements
                  </Link>

                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-xs text-neutral-700 hover:bg-luxury-cream-100 hover:text-luxury-gold-700 font-medium"
                  >
                    My Concierge Orders
                  </Link>

                  <button
                    onClick={() => {
                      logoutCustomer();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 border-t border-neutral-100 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Global Interactive Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-luxury-black/90 backdrop-blur-md flex flex-col items-center p-4 sm:p-8 animate-in fade-in duration-200">

          <button
            onClick={() => setSearchOpen(false)}
            className="self-end p-2 text-neutral-400 hover:text-white"
            aria-label="Close search"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="w-full max-w-2xl mt-8">

            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                ref={searchInputRef}
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search royal sherwanis, festive kurtas, bandhgalas..."
                className="w-full bg-transparent border-b-2 border-luxury-gold-500 py-3 pr-12 text-lg sm:text-2xl text-white placeholder-neutral-500 focus:outline-none font-serif tracking-wide"
              />

              <button
                type="submit"
                className="absolute right-0 top-3 text-luxury-gold-400 hover:text-luxury-gold-300"
              >
                <Search className="w-7 h-7" />
              </button>
            </form>

            {/* Live Search Suggestions */}
            {searchResults.length > 0 && (
              <div className="mt-6 bg-white shadow-2xl border border-neutral-200 divide-y divide-neutral-100">

                {searchResults.map((item) => (
                  <Link
                    key={item.id}
                    to={`/product/${item.id}`}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-4 p-3 hover:bg-luxury-cream-50 transition-colors"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-12 h-14 object-cover object-top border"
                    />

                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-widest text-luxury-gold-700 font-semibold">
                        {item.category}
                      </p>

                      <h4 className="font-serif text-sm font-semibold text-neutral-900">
                        {item.name}
                      </h4>
                    </div>

                    <span className="font-bold text-sm text-neutral-900">
                      {formatPrice(item.price)}
                    </span>
                  </Link>
                ))}

                <div className="p-3 bg-neutral-50 text-center">
                  <button
                    onClick={handleSearchSubmit}
                    className="text-xs font-bold uppercase tracking-wider text-luxury-gold-700 hover:text-luxury-gold-800"
                  >
                    View all matching results for "{searchQuery}"
                  </button>
                </div>
              </div>
            )}

            {/* Popular Search Suggestions */}
            {!searchQuery && (
              <div className="mt-8">
                <span className="text-xs uppercase tracking-widest text-neutral-400 block mb-3 font-semibold">
                  Popular Ensembles
                </span>

                <div className="flex flex-wrap gap-2">
                  {[
                    'Royal Sherwani',
                    'Velvet Bandhgala',
                    'Raw Silk Kurta',
                    'Benarasi Brocade',
                    'Chikankari Pastel',
                    'Sangeet Draped'
                  ].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setSearchQuery(tag);
                      }}
                      className="px-3 py-1.5 text-xs text-luxury-cream-100 bg-neutral-900 hover:bg-luxury-gold-500 hover:text-luxury-black border border-neutral-700 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Slide-Out Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">

          <div
            className="fixed inset-0 bg-luxury-black/80 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-sm bg-luxury-black text-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300 border-r border-luxury-gold-500/30">

            {/* Mobile Menu Header */}
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
              <img
                src={logoImg}
                alt="L-KUSH Couture"
                className="h-9 w-auto"
              />

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation links */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4">

              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block py-2.5 text-sm uppercase tracking-widest text-neutral-200 hover:text-luxury-gold-400 font-medium border-b border-neutral-800/60"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="pt-4 border-t border-neutral-800 space-y-2 text-xs tracking-wider uppercase text-neutral-400">

                <Link
                  to="/orders"
                  className="block py-1.5 hover:text-white"
                >
                  Order Tracking
                </Link>

                <Link
                  to="/notifications"
                  className="block py-1.5 hover:text-white"
                >
                  Notifications ({unreadCount})
                </Link>
              </div>
            </div>

            {/* Mobile Menu Footer */}
            <div className="p-5 border-t border-neutral-800 bg-neutral-950">
              {isAuthenticated ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">
                      {customer?.name}
                    </p>

                    <p className="text-[10px] text-neutral-400">
                      {customer?.email}
                    </p>
                  </div>

                  <button
                    onClick={logoutCustomer}
                    className="text-xs text-rose-400 hover:text-rose-300 font-semibold uppercase"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="block text-center py-2.5 text-xs font-bold uppercase tracking-wider bg-luxury-gold-500 text-luxury-black"
                >
                  Client Sign In
                </Link>
              )}
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
