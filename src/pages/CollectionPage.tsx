import React, { useState, useMemo } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Product, ProductCategory } from '../types';
import { useShop } from '../context/ShopContext';
import { ArrowDown, SlidersHorizontal, X } from 'lucide-react';

interface CollectionPageProps {
  category: ProductCategory;
  onOpenProduct: (product: Product) => void;
}

export const CollectionPage: React.FC<CollectionPageProps> = ({
  category,
  onOpenProduct,
}) => {
  const { products } = useShop();

  // Filter & Sorting state
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'newest' | 'rating'>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(12000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  // Category Configuration
  const categoryConfig = {
    watches: {
      title: 'WATCHES',
      tagline: 'Make Every Second Count.',
      description: 'Surgical-grade 316L stainless steel, scratch-resistant sapphire glass, and Japanese mechanical movements engineered for lifelong precision.',
      heroImage: '/src/assets/images/veslii_watch_hero_1790776419008.jpg',
      bgTheme: 'bg-[#0F1115] text-white',
      accentColor: 'text-neutral-300',
    },
    wallets: {
      title: 'WALLETS',
      tagline: 'Carry Your Style.',
      description: 'Full-grain Italian vegetable-tanned leather handcrafted with aerospace-grade RFID shielding to safeguard your cards and cash without pocket bulk.',
      heroImage: '/src/assets/images/veslii_wallet_hero_1790776435129.jpg',
      bgTheme: 'bg-[#181513] text-white',
      accentColor: 'text-amber-200/90',
    },
    serum: {
      title: 'SERUM',
      tagline: 'Simple Care. Everyday Confidence.',
      description: 'Dermatologically evaluated clinical actives including multi-weight Hyaluronic Acid, Vitamin C 15%, and plant Bakuchiol for radiant barrier defense.',
      heroImage: '/src/assets/images/veslii_serum_hero_1790776449984.jpg',
      bgTheme: 'bg-[#F4F4F3] text-neutral-900 border-b border-neutral-200',
      accentColor: 'text-neutral-600',
    },
  }[category];

  // Filter category products
  const categoryProducts = useMemo(() => {
    return products.filter((p) => p.category === category);
  }, [products, category]);

  // Extract available colors for this category
  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    categoryProducts.forEach((p) => {
      p.variants.forEach((v) => colors.add(v.colorName));
    });
    return Array.from(colors);
  }, [categoryProducts]);

  // Apply filters & sort
  const filteredProducts = useMemo(() => {
    let result = categoryProducts.filter((p) => {
      const withinPrice = p.price <= maxPrice;
      const stockOk = !inStockOnly || p.stock > 0;
      const colorOk =
        selectedColor === 'all' ||
        p.variants.some((v) => v.colorName.toLowerCase() === selectedColor.toLowerCase());
      return withinPrice && stockOk && colorOk;
    });

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [categoryProducts, maxPrice, inStockOnly, selectedColor, sortBy]);

  const hasActiveFilters = maxPrice < 12000 || inStockOnly || selectedColor !== 'all';

  const resetFilters = () => {
    setMaxPrice(12000);
    setInStockOnly(false);
    setSelectedColor('all');
    setSortBy('featured');
  };

  const scrollToGrid = () => {
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full">
      {/* 1. Category Hero Banner */}
      <div className={`relative min-h-[50vh] sm:min-h-[60vh] flex items-center overflow-hidden ${categoryConfig.bgTheme}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left text */}
            <div className="lg:col-span-7">
              <span className="text-[11px] font-semibold tracking-[0.3em] uppercase opacity-75 block mb-3">
                VESLII ARCHIVE
              </span>

              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight mb-4">
                {categoryConfig.title}
              </h1>

              <p className={`text-base sm:text-xl font-light mb-6 tracking-wide ${categoryConfig.accentColor}`}>
                “{categoryConfig.tagline}”
              </p>

              <p className="text-xs sm:text-sm font-light leading-relaxed max-w-lg mb-8 opacity-85">
                {categoryConfig.description}
              </p>

              <button
                type="button"
                onClick={scrollToGrid}
                className={`px-8 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-200 inline-flex items-center gap-2 ${
                  category === 'serum'
                    ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                    : 'bg-white text-neutral-900 hover:bg-neutral-200'
                }`}
              >
                <span>SHOP {categoryConfig.title}</span>
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>

            {/* Right photograph */}
            <div className="lg:col-span-5 relative aspect-4/3 overflow-hidden shadow-2xl">
              <img
                src={categoryConfig.heroImage}
                alt={categoryConfig.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Product Listing Section */}
      <section id="products-section" className="py-12 sm:py-16 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Control Bar: Live Count, Filters toggle, Sorting */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setShowFiltersMobile(!showFiltersMobile)}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-neutral-300 text-xs font-semibold uppercase tracking-wider text-neutral-900 hover:bg-neutral-100 sm:hidden"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters {hasActiveFilters && '(Active)'}</span>
              </button>

              <span className="text-xs text-neutral-500 font-medium">
                Showing <strong className="text-neutral-900 tabular-nums">{filteredProducts.length}</strong> of{' '}
                <strong className="text-neutral-900 tabular-nums">{categoryProducts.length}</strong> products
              </span>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
              <label htmlFor="sort-select" className="text-neutral-500 font-medium whitespace-nowrap">
                Sort By:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-white border border-neutral-300 text-neutral-900 text-xs focus:outline-none focus:border-neutral-900 font-medium"
              >
                <option value="featured">Featured Collection</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Releases</option>
                <option value="rating">Highest Customer Rating</option>
              </select>
            </div>
          </div>

          {/* Active Filter Indicators */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-4 pb-2">
              <span className="text-[11px] text-neutral-500 uppercase tracking-wider mr-1">
                Active Filters:
              </span>
              {maxPrice < 12000 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-200/80 text-neutral-900 text-[11px]">
                  <span>Under Rs. {maxPrice.toLocaleString()}</span>
                  <button onClick={() => setMaxPrice(12000)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-200/80 text-neutral-900 text-[11px]">
                  <span>In Stock Only</span>
                  <button onClick={() => setInStockOnly(false)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedColor !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-200/80 text-neutral-900 text-[11px]">
                  <span>Color: {selectedColor}</span>
                  <button onClick={() => setSelectedColor('all')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={resetFilters}
                className="text-[11px] text-neutral-600 hover:text-black underline ml-2"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Filter Bar (Collapsible on mobile, permanent row on desktop) */}
          <div className={`mt-6 ${showFiltersMobile ? 'block' : 'hidden sm:block'}`}>
            <div className="p-4 sm:p-5 bg-white border border-neutral-200/80 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Max Price Range Slider */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-neutral-800 mb-2">
                  <span>Maximum Price</span>
                  <span className="tabular-nums">Rs. {maxPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="12000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-neutral-900"
                />
                <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                  <span>Rs. 2,000</span>
                  <span>Rs. 12,000</span>
                </div>
              </div>

              {/* Color variant filter */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-800 mb-2">
                  Color / Finish
                </label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                >
                  <option value="all">All Finishes & Colors</option>
                  {availableColors.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* In stock toggle */}
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-neutral-800 font-medium">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 accent-neutral-900 rounded-none"
                  />
                  <span>Show In-Stock Items Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-white border border-neutral-200">
              <h3 className="text-lg font-serif text-neutral-900 mb-2">
                No products match your selected filters
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 mb-6 max-w-sm mx-auto">
                Try widening your price range or clearing specific color filters.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-6 py-2.5 bg-neutral-950 text-white text-xs font-semibold tracking-widest uppercase hover:bg-neutral-800 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenProduct={onOpenProduct}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
