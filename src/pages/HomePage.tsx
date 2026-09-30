import React from 'react';
import { Hero } from '../components/Hero';
import { CategoryShowcase } from '../components/CategoryShowcase';
import { ProductCard } from '../components/ProductCard';
import { VesliiEdit } from '../components/VesliiEdit';
import { WhyVeslii } from '../components/WhyVeslii';
import { ReviewsSection } from '../components/ReviewsSection';
import { SocialGallery } from '../components/SocialGallery';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { ArrowRight } from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onOpenProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenProduct }) => {
  const { products } = useShop();

  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNewArrival || !p.isBestSeller).slice(0, 4);

  // Aggregate all genuine customer reviews across products
  const allReviews = products.flatMap((p) => p.reviews || []).slice(0, 6);

  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <Hero
        onShopCollection={() => onNavigate('/collections/watches')}
        onExploreVeslii={() => onNavigate('/collections/wallets')}
      />

      {/* 2. Shop by Category (3 cards) */}
      <CategoryShowcase
        onSelectCategory={(catId) => onNavigate(`/collections/${catId}`)}
      />

      {/* 3. Best Sellers */}
      <section className="py-20 sm:py-24 bg-white border-t border-neutral-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[11px] font-semibold tracking-[0.25em] text-neutral-500 uppercase">
                MOST COVETED
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-neutral-900 mt-1 mb-2">
                Best Sellers
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500">
                Signature essentials chosen by gentlemen and modern tastemakers across Pakistan.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/collections/watches')}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-neutral-900 hover:text-neutral-600 transition-colors self-start sm:self-auto group"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenProduct={onOpenProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. The VESLII Edit (Full-width editorial banner) */}
      <VesliiEdit onExploreCollection={() => onNavigate('/collections/wallets')} />

      {/* 5. Why VESLII (4 trust items) */}
      <WhyVeslii />

      {/* 6. New Arrivals */}
      <section className="py-20 sm:py-24 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[11px] font-semibold tracking-[0.25em] text-neutral-500 uppercase">
                FRESHLY UNVEILED
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-neutral-900 mt-1 mb-2">
                New Arrivals
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500">
                Newly catalogued automatic movements, Italian leather folios, and botanical serums.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/collections/serum')}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-neutral-900 hover:text-neutral-600 transition-colors self-start sm:self-auto group"
            >
              <span>Explore New Releases</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenProduct={onOpenProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Customer Reviews (Genuine Reviews Only) */}
      <ReviewsSection reviews={allReviews} />

      {/* 8. Instagram / Social Gallery */}
      <SocialGallery />
    </div>
  );
};
