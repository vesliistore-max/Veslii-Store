import React from 'react';
import { ShieldCheck, Sparkles, Scale, Truck } from 'lucide-react';

export const WhyVeslii: React.FC = () => {
  const trustPoints = [
    {
      icon: ShieldCheck,
      title: 'Carefully Selected',
      description: 'Every material—from Japanese movements and sapphire glass to full-grain leather and clinical serum actives—passes meticulous quality checks.',
    },
    {
      icon: Sparkles,
      title: 'Premium Feel',
      description: 'Heavier steel weights, seamless edge stitching, and uncompromised textures designed to stand the test of continuous everyday wear.',
    },
    {
      icon: Scale,
      title: 'Fair Pricing',
      description: 'Direct-to-consumer model removing middleman markup so you experience luxury horology and leathercraft at genuine, accessible prices in PKR.',
    },
    {
      icon: Truck,
      title: 'Nationwide Delivery',
      description: 'Reliable express dispatch across Pakistan (Lahore, Karachi, Islamabad & nationwide) in 2–4 business days with Cash on Delivery support.',
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-white border-y border-neutral-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-[11px] font-semibold tracking-[0.25em] text-neutral-500 uppercase">
            THE PHILOSOPHY
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-neutral-900 mt-2 mb-3">
            Why VESLII
          </h2>
          <p className="text-neutral-600 text-sm">
            Bridging the gap between luxury aesthetics and genuine everyday affordability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {trustPoints.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex flex-col items-center sm:items-start text-center sm:text-left p-2"
              >
                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 mb-4 transition-transform hover:scale-105">
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <h3 className="text-base font-semibold text-neutral-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
