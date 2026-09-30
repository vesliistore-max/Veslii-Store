import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../data/products';

interface CategoryShowcaseProps {
  onSelectCategory: (categoryId: 'watches' | 'wallets' | 'serum') => void;
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ onSelectCategory }) => {
  return (
    <section className="py-20 sm:py-28 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] font-semibold tracking-[0.25em] text-neutral-500 uppercase">
            ARCHITECTURAL DISCIPLINE
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal text-neutral-900 mt-2 mb-3">
            Shop by Category
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base">
            Three foundational collections engineered to elevate your daily routine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group relative cursor-pointer overflow-hidden bg-neutral-900 border border-neutral-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-end min-h-[460px] sm:min-h-[500px]"
            >
              {/* Background Product Image */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                {/* Measured Scrim for Media Overlays (WCAG contrast compliant) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
              </div>

              {/* Content overlay */}
              <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-end text-white">
                <span className="text-[11px] tracking-[0.25em] uppercase text-neutral-300 font-medium mb-1.5">
                  Collection
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-white mb-2">
                  {cat.name}
                </h3>
                <p className="text-neutral-300 text-xs sm:text-sm font-light mb-6 line-clamp-2 leading-relaxed">
                  {cat.tagline}
                </p>

                <div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-white pb-1 border-b border-white group-hover:border-neutral-300 transition-colors"
                  >
                    <span>Shop Now</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
