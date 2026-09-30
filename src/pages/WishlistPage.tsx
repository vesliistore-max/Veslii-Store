import React from 'react';
import { Heart, ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

interface WishlistPageProps {
  onBackToHome: () => void;
  onOpenProduct: (product: Product) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  onBackToHome,
  onOpenProduct,
}) => {
  const { wishlist, products } = useShop();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 hover:text-black mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </button>

        <div className="mb-8 pb-4 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold tracking-[0.25em] text-neutral-500 uppercase">
              PERSONAL CURATION
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif text-neutral-900 mt-1">
              Your Wishlist ({wishlistedProducts.length})
            </h1>
          </div>
        </div>

        {wishlistedProducts.length === 0 ? (
          <div className="py-20 text-center bg-white border border-neutral-200">
            <Heart className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h2 className="text-lg font-serif text-neutral-900 mb-1">
              Your wishlist is currently empty
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto mb-6">
              Click the heart icon on any watch, wallet, or serum to save it to your private wishlist.
            </p>
            <button
              type="button"
              onClick={onBackToHome}
              className="px-6 py-2.5 bg-neutral-950 text-white text-xs font-semibold tracking-widest uppercase hover:bg-neutral-800 transition-colors"
            >
              Discover Best Sellers
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {wishlistedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onOpenProduct={onOpenProduct}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
