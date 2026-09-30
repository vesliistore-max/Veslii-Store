import React from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';

interface HeroProps {
  onShopCollection: () => void;
  onExploreVeslii: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopCollection, onExploreVeslii }) => {
  return (
    <section className="relative min-h-[82vh] flex flex-col items-center justify-center bg-gradient-to-b from-white via-[#F9F9F8] to-[#F3F4F6] text-center px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-neutral-200/60">
      {/* Subtle architectural geometric watermarks/lines */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-neutral-300/40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[980px] h-[980px] rounded-full border border-neutral-300/20" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto py-16 sm:py-24 flex flex-col items-center">
        {/* Subtle Brand Tag Header */}
        <span className="text-[11px] sm:text-xs font-semibold tracking-[0.35em] text-neutral-500 uppercase mb-6 sm:mb-8 animate-in fade-in duration-700">
          THE MODERN ESSENTIALS ARCHIVE
        </span>

        {/* Large Centered VESLII Logo */}
        <div className="mb-6 sm:mb-8 transition-transform duration-700 ease-out hover:scale-[1.01]">
          <h1 className="font-brand text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-[0.26em] text-neutral-950 select-none">
            VESLII
          </h1>
        </div>

        {/* Tagline */}
        <div className="inline-flex items-center gap-3 mb-4 sm:mb-5">
          <div className="h-[1px] w-6 sm:w-10 bg-neutral-400" />
          <h2 className="text-xs sm:text-sm md:text-base font-semibold tracking-[0.25em] text-neutral-900 uppercase">
            PREMIUM-YET AFFORDABLE
          </h2>
          <div className="h-[1px] w-6 sm:w-10 bg-neutral-400" />
        </div>

        {/* Supporting text */}
        <p className="text-base sm:text-lg md:text-xl text-neutral-600 font-light max-w-xl mx-auto mb-10 sm:mb-12 leading-relaxed">
          Curated essentials for your everyday style. Crafted with precision horology, fine Italian leathers, and pure botanical skincare.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            type="button"
            onClick={onShopCollection}
            className="w-full sm:w-auto px-8 py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold tracking-[0.22em] uppercase rounded-none transition-all duration-200 flex items-center justify-center gap-2 group shadow-sm"
          >
            <span>SHOP COLLECTION</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            type="button"
            onClick={onExploreVeslii}
            className="w-full sm:w-auto px-8 py-3.5 bg-transparent hover:bg-neutral-100 text-neutral-900 border border-neutral-900 text-xs font-semibold tracking-[0.22em] uppercase rounded-none transition-all duration-200"
          >
            EXPLORE VESLII
          </button>
        </div>
      </div>

      {/* Subtle bottom scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-neutral-400 flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
        <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
      </div>
    </section>
  );
};
