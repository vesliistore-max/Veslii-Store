import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Mail, MapPin, Phone } from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { openPolicy } = useShop();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubscribed(true);
        setEmail('');
      } else {
        setSubscribed(true);
      }
    } catch {
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#121212] text-neutral-300 pt-16 sm:pt-20 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-16 border-b border-neutral-800">
          {/* Brand Info & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-brand text-2xl font-bold tracking-[0.28em] text-white block">
              VESLII
            </span>
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-medium">
              PREMIUM-YET AFFORDABLE
            </p>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed max-w-sm">
              We curate minimalist timepieces, full-grain leather wallets, and clean botanical skincare. No exaggerated markups, no synthetic compromises.
            </p>

            <div className="pt-2 space-y-2 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span>Lahore & Islamabad Fulfillment Centers, Pakistan</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span>vesliistore@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span>+92 (300) 847-2190 (Mon-Sat, 10am-7pm PKT)</span>
              </div>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-white mb-4">
              COLLECTIONS
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/collections/watches')}
                  className="hover:text-white transition-colors"
                >
                  Shop Watches
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/collections/wallets')}
                  className="hover:text-white transition-colors"
                >
                  Shop Wallets
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/collections/serum')}
                  className="hover:text-white transition-colors"
                >
                  Shop Serum
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/')}
                  className="hover:text-white transition-colors"
                >
                  The VESLII Edit
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-white mb-4">
              ASSISTANCE
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <button
                  type="button"
                  onClick={() => openPolicy('shipping')}
                  className="hover:text-white transition-colors text-left"
                >
                  Shipping Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openPolicy('returns')}
                  className="hover:text-white transition-colors text-left"
                >
                  Returns & Replacements
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openPolicy('faq')}
                  className="hover:text-white transition-colors text-left"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openPolicy('privacy')}
                  className="hover:text-white transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openPolicy('terms')}
                  className="hover:text-white transition-colors text-left"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openPolicy('about')}
                  className="hover:text-white transition-colors text-left"
                >
                  About VESLII
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-white mb-4">
              THE VESLII JOURNAL
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed mb-4">
              Receive private drop alerts, archival stories, and an immediate 10% voucher for your first acquisition.
            </p>

            {subscribed ? (
              <div className="p-3 bg-neutral-900 border border-neutral-700 text-xs text-neutral-200 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Subscribed! Use code <strong className="text-white">VESLII10</strong> at checkout.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors pr-10"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-white transition-colors"
                    aria-label="Submit newsletter subscription"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-[10px] text-neutral-500 block">
                  Zero spam. Unsubscribe at any time.
                </span>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright and legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} VESLII. All rights reserved. Curated for Pakistan.</p>
          <div className="flex items-center gap-6">
            <span>Prices displayed in PKR (Rs.)</span>
            <span className="text-neutral-700">|</span>
            <span>COD & Bank Transfer</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
