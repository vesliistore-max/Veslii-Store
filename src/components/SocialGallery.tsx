import React from 'react';
import { Instagram } from 'lucide-react';

export const SocialGallery: React.FC = () => {
  const galleryItems = [
    {
      image: '/src/assets/images/veslii_watch_hero_1790776419008.jpg',
      caption: 'The VESLII Chrono 40mm on architectural travertine. Precision horology for the daily grind.',
      tag: '@vesliistore',
    },
    {
      image: '/src/assets/images/veslii_wallet_hero_1790776435129.jpg',
      caption: 'Top-grain vegetable tanned leather that ages alongside you. Zero synthetic filler.',
      tag: '@vesliistore',
    },
    {
      image: '/src/assets/images/veslii_serum_hero_1790776449984.jpg',
      caption: 'Pure actives, non-sticky absorption. Skincare stripped of unnecessary hype.',
      tag: '@vesliistore',
    },
    {
      image: '/src/assets/images/veslii_editorial_banner_1790776402134.jpg',
      caption: 'The complete daily kit. Watch, wallet, essentials. #VESLII',
      tag: '@vesliistore',
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-white border-t border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[11px] font-semibold tracking-[0.25em] text-neutral-500 uppercase">
              AS SEEN ON INSTAGRAM
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-neutral-900 mt-1 mb-1">
              Curated Everyday Moments
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              Tag <span className="text-neutral-900 font-medium">#VESLII</span> or mention{' '}
              <span className="text-neutral-900 font-medium">@vesliistore</span> to be featured.
            </p>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-neutral-900 hover:text-neutral-600 transition-colors self-start sm:self-auto"
          >
            <Instagram className="w-4 h-4" />
            <span>Follow @vesliistore</span>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden bg-neutral-100 cursor-pointer"
            >
              <img
                src={item.image}
                alt="VESLII Instagram moment"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                <Instagram className="w-5 h-5 mb-2 text-white/90" />
                <p className="text-xs line-clamp-2 font-light text-neutral-200 mb-1">
                  {item.caption}
                </p>
                <span className="text-[10px] tracking-wider text-neutral-400">
                  {item.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
