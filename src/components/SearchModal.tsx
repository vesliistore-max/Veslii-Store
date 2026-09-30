import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, Star } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';
import { formatPKR } from '../utils/formatters';

interface SearchModalProps {
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (category: 'watches' | 'wallets' | 'serum') => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  onSelectProduct,
  onSelectCategory,
}) => {
  const { products, isSearchOpen, closeSearch } = useShop();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;
    const q = query.toLowerCase().trim();
    if (!q) return matchesCategory;
    const matchesQuery =
      p.name.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  const popularSearches = ['Chrono', 'Bifold Wallet', 'Hyaluronic', 'Automatic', 'Cardholder'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeSearch}
      />

      <div className="relative min-h-screen sm:min-h-0 sm:mt-16 max-w-3xl mx-auto bg-white shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 pb-4 border-b border-neutral-200">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search watches, wallets, serums..."
            className="w-full text-base sm:text-lg text-neutral-900 placeholder-neutral-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-neutral-400 hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={closeSearch}
            className="p-1.5 text-neutral-500 hover:text-black rounded-full hover:bg-neutral-100"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Filter tabs */}
        <div className="flex items-center gap-2 py-4 border-b border-neutral-100 text-xs overflow-x-auto">
          <span className="text-neutral-400 uppercase tracking-wider text-[11px] shrink-0">
            Filter:
          </span>
          {['all', 'watches', 'wallets', 'serum'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 uppercase tracking-wider text-[11px] font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Popular searches suggestions */}
        {!query && (
          <div className="py-4">
            <span className="text-[11px] text-neutral-400 uppercase tracking-widest block mb-2">
              Popular Searches
            </span>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-xs text-neutral-800 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        <div className="py-4 max-h-[60vh] overflow-y-auto space-y-3 divide-y divide-neutral-100">
          <div className="text-xs text-neutral-400 mb-2 font-medium">
            Found {filteredProducts.length} product{filteredProducts.length === 1 ? '' : 's'}
          </div>

          {filteredProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                closeSearch();
                onSelectProduct(p);
              }}
              className="pt-3 flex items-center gap-4 cursor-pointer group hover:bg-neutral-50 p-2 transition-colors"
            >
              <img
                src={p.images[0]}
                alt={p.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 object-cover shrink-0 border border-neutral-200"
              />
              <div className="flex-1">
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">
                  {p.category}
                </span>
                <h4 className="text-sm font-semibold text-neutral-900 group-hover:text-neutral-700">
                  {p.name}
                </h4>
                <p className="text-xs text-neutral-500 line-clamp-1">
                  {p.tagline}
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-neutral-900 tabular-nums block">
                  {formatPKR(p.price)}
                </span>
                {p.originalPrice && (
                  <span className="text-xs text-neutral-400 line-through tabular-nums">
                    {formatPKR(p.originalPrice)}
                  </span>
                )}
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-neutral-500 text-sm">
              No matching products found for "{query}". Try checking your spelling or searching by category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
