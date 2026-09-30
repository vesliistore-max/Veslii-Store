import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const { cartTotalCount, wishlist, openCart, openSearch, openAccount } = useShop();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'HOME', path: '/' },
    { label: 'WATCHES', path: '/collections/watches' },
    { label: 'WALLETS', path: '/collections/wallets' },
    { label: 'SERUM', path: '/collections/serum' },
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#121212] text-neutral-300 text-[11px] tracking-widest uppercase py-2 px-4 text-center select-none border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <span>Nationwide Express Delivery</span>
          <span className="text-neutral-500">·</span>
          <span className="text-white font-medium">Free Shipping Over Rs. 4,999</span>
          <span className="text-neutral-500">·</span>
          <span>Cash on Delivery</span>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-xs py-3.5 border-b border-neutral-200/80'
            : 'bg-white py-5 border-b border-neutral-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left Zone: Brand Logo */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-1.5 -ml-1.5 text-neutral-800 hover:text-black md:hidden transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <button
                onClick={() => handleNavClick('/')}
                className="text-left group focus:outline-none"
              >
                <span className="font-brand text-xl sm:text-2xl font-bold tracking-[0.28em] text-neutral-950 transition-colors group-hover:text-neutral-800">
                  VESLII
                </span>
              </button>
            </div>

            {/* Center Zone: 4-6 Clean Text Links */}
            <nav className="hidden md:flex items-center gap-8 lg:gap-10">
              {navItems.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.path)}
                    className={`relative text-xs tracking-[0.2em] font-medium transition-colors py-1 ${
                      isActive
                        ? 'text-neutral-950 font-semibold'
                        : 'text-neutral-600 hover:text-neutral-950'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-neutral-950 transition-all" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Zone: Primary Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={openSearch}
                className="p-2 text-neutral-700 hover:text-black transition-colors rounded-full hover:bg-neutral-100"
                aria-label="Search collection"
                title="Search products"
              >
                <Search className="w-5 h-5" strokeWidth={1.75} />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('/wishlist')}
                className="p-2 text-neutral-700 hover:text-black transition-colors rounded-full hover:bg-neutral-100 relative"
                aria-label="View wishlist"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" strokeWidth={1.75} />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-neutral-900 rounded-full" />
                )}
              </button>

              <button
                type="button"
                onClick={openAccount}
                className="p-2 text-neutral-700 hover:text-black transition-colors rounded-full hover:bg-neutral-100"
                aria-label="Account and orders"
                title="Account / Track Order"
              >
                <User className="w-5 h-5" strokeWidth={1.75} />
              </button>

              <button
                type="button"
                onClick={openCart}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 text-neutral-900 hover:text-black transition-colors rounded-full hover:bg-neutral-100 relative"
                aria-label={`Shopping bag with ${cartTotalCount} items`}
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={1.75} />
                <span className="text-xs font-semibold tabular-nums">
                  {cartTotalCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between p-6 z-10 animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
                <span className="font-brand text-xl font-bold tracking-[0.25em]">
                  VESLII
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-neutral-500 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 space-y-4">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.path)}
                    className="block w-full text-left text-sm tracking-[0.2em] font-medium py-2.5 text-neutral-800 hover:text-black border-b border-neutral-50"
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={() => handleNavClick('/wishlist')}
                  className="block w-full text-left text-sm tracking-[0.2em] font-medium py-2.5 text-neutral-800 hover:text-black border-b border-neutral-50"
                >
                  WISHLIST ({wishlist.length})
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAccount();
                  }}
                  className="block w-full text-left text-sm tracking-[0.2em] font-medium py-2.5 text-neutral-800 hover:text-black"
                >
                  TRACK ORDER / ACCOUNT
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-100 text-xs text-neutral-500 space-y-2">
              <p className="font-medium text-neutral-900">PREMIUM-YET AFFORDABLE</p>
              <p>Direct support: contact@veslii.com</p>
              <p>Nationwide Delivery Across Pakistan</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
