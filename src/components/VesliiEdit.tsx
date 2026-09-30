import React from 'react';
import { ArrowRight } from 'lucide-react';

interface VesliiEditProps {
  onExploreCollection: () => void;
}

export const VesliiEdit: React.FC<VesliiEditProps> = ({ onExploreCollection }) => {
  return (
    <section className="relative w-full py-24 sm:py-32 overflow-hidden bg-neutral-950 text-white">
      {/* Background visual asset */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/veslii_editorial_banner_1790776402134.jpg"
          alt="The VESLII Edit"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-45 transition-transform duration-1000 ease-out hover:scale-102"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/70 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-neutral-400" />
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-neutral-300">
              EDITORIAL CURATION
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-white mb-4 leading-tight">
            THE VESLII EDIT
          </h2>

          <p className="text-neutral-300 text-base sm:text-lg font-light mb-8 max-w-md leading-relaxed">
            Carefully selected. Always worth it. A quiet dialogue between precision horology and artisanal leathercraft.
          </p>

          <button
            type="button"
            onClick={onExploreCollection}
            className="px-8 py-3.5 bg-white text-neutral-950 hover:bg-neutral-200 text-xs font-semibold tracking-[0.22em] uppercase transition-all duration-200 inline-flex items-center gap-2 group"
          >
            <span>EXPLORE COLLECTION</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
