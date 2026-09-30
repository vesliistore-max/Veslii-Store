import React, { useState } from 'react';
import { X, Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';
import { formatPKR, calculateDiscount } from '../utils/formatters';

interface QuickViewModalProps {
  onViewFullDetails: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ onViewFullDetails }) => {
  const { quickViewProduct, setQuickView, addToCart } = useShop();
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const currentVariant =
    quickViewProduct.variants[selectedVariantIdx] || quickViewProduct.variants[0];
  const activeImage = currentVariant?.image || quickViewProduct.images[0];
  const discount = calculateDiscount(
    quickViewProduct.price,
    quickViewProduct.originalPrice
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setQuickView(null)}
      />

      <div className="relative min-h-screen sm:min-h-0 sm:my-12 max-w-4xl mx-auto bg-white shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={() => setQuickView(null)}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Image */}
          <div className="relative aspect-4/3 bg-neutral-100 overflow-hidden border border-neutral-200">
            <img
              src={activeImage}
              alt={quickViewProduct.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {discount && (
              <span className="absolute top-3 left-3 bg-neutral-950 text-white text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5">
                {discount}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 mb-1.5 font-medium">
                <span>{quickViewProduct.category}</span>
                {quickViewProduct.rating > 0 && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-neutral-800">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="tabular-nums font-semibold">
                        {quickViewProduct.rating}
                      </span>
                      <span className="text-neutral-400">
                        ({quickViewProduct.reviewCount})
                      </span>
                    </span>
                  </>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-serif text-neutral-900 mb-2">
                {quickViewProduct.name}
              </h2>

              <p className="text-xs sm:text-sm text-neutral-600 font-light mb-4 leading-relaxed">
                {quickViewProduct.shortDescription}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-2xl font-bold text-neutral-950 tabular-nums">
                  {formatPKR(quickViewProduct.price)}
                </span>
                {quickViewProduct.originalPrice && (
                  <span className="text-sm text-neutral-400 line-through tabular-nums">
                    {formatPKR(quickViewProduct.originalPrice)}
                  </span>
                )}
              </div>

              {/* Variants */}
              {quickViewProduct.variants.length > 1 && (
                <div className="mb-6">
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 font-medium mb-2">
                    Color / Finish: <strong>{currentVariant?.colorName}</strong>
                  </label>
                  <div className="flex items-center gap-2">
                    {quickViewProduct.variants.map((v, idx) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariantIdx(idx)}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          selectedVariantIdx === idx
                            ? 'border-neutral-950 ring-2 ring-neutral-900 ring-offset-2 scale-105'
                            : 'border-neutral-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: v.colorHex }}
                        title={v.colorName}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Key specs teaser */}
              <div className="border-t border-neutral-100 pt-4 mb-6">
                <ul className="text-xs text-neutral-600 space-y-1">
                  {quickViewProduct.highlights.slice(0, 3).map((h, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-neutral-200">
              <div className="flex gap-3">
                <div className="flex items-center border border-neutral-300">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-neutral-600 hover:bg-neutral-100"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-semibold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(quickViewProduct.stock, quantity + 1))}
                    className="px-3 py-2 text-neutral-600 hover:bg-neutral-100"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    addToCart(quickViewProduct, currentVariant.id, quantity);
                    setQuickView(null);
                  }}
                  className="flex-1 py-3 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold tracking-widest uppercase transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  const p = quickViewProduct;
                  setQuickView(null);
                  onViewFullDetails(p);
                }}
                className="w-full text-center text-xs text-neutral-600 hover:text-black py-1.5 tracking-wider uppercase inline-flex items-center justify-center gap-1.5"
              >
                <span>View Full Product Specifications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
