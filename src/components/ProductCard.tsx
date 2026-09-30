import React, { useState } from 'react';
import { Eye, Heart, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { formatPKR, calculateDiscount } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  onOpenProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenProduct }) => {
  const { addToCart, toggleWishlist, isInWishlist, setQuickView } = useShop();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const currentVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const activeImage = currentVariant?.image || product.images[0];
  const isWishlisted = isInWishlist(product.id);
  const discountLabel = calculateDiscount(product.price, product.originalPrice);

  const handleCardClick = (e: React.MouseEvent) => {
    // Only open product detail if clicking non-button elements
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    onOpenProduct(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative cursor-pointer flex flex-col bg-white border border-neutral-200/70 hover:border-neutral-300 transition-all duration-300 hover:shadow-md"
    >
      {/* Image container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-[#F5F5F4] flex items-center justify-center">
        <img
          src={activeImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges: e.g. Discount or Best Seller */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="text-[10px] tracking-wider uppercase font-semibold text-neutral-900 bg-white/90 backdrop-blur-xs px-2 py-0.5 shadow-2xs">
              BESTSELLER
            </span>
          )}
          {discountLabel && (
            <span className="text-[10px] tracking-wider uppercase font-semibold text-white bg-neutral-950 px-2 py-0.5 shadow-2xs">
              {discountLabel}
            </span>
          )}
        </div>

        {/* Wishlist toggle button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full transition-all duration-200 ${
            isWishlisted
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'bg-white/80 backdrop-blur-xs text-neutral-700 hover:bg-white hover:text-black shadow-2xs'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View overlay button */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setQuickView(product);
            }}
            className="flex-1 py-2 px-3 bg-white/95 hover:bg-white text-neutral-900 text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Unboxed clean metadata (Zero-Pill discipline) */}
          <div className="flex items-center gap-2 text-[11px] text-neutral-500 uppercase tracking-widest mb-1.5 font-medium">
            <span>{product.category}</span>
            {product.rating > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-neutral-800">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="tabular-nums font-semibold">{product.rating}</span>
                  <span className="text-neutral-400">({product.reviewCount})</span>
                </span>
              </>
            )}
          </div>

          {/* Product Title */}
          <h3 className="text-sm sm:text-base font-semibold text-neutral-900 line-clamp-1 mb-1 group-hover:text-neutral-700 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-neutral-500 line-clamp-1 mb-3">
            {product.tagline}
          </p>

          {/* Color variant swatches (if multiple) */}
          {product.variants.length > 1 && (
            <div className="flex items-center gap-1.5 mb-3.5" onClick={(e) => e.stopPropagation()}>
              {product.variants.map((v, idx) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariantIndex(idx)}
                  className={`w-4 h-4 rounded-full border transition-all ${
                    selectedVariantIndex === idx
                      ? 'ring-2 ring-neutral-900 ring-offset-1 scale-110'
                      : 'border-neutral-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: v.colorHex }}
                  title={v.colorName}
                  aria-label={`Select ${v.colorName}`}
                />
              ))}
              <span className="text-[11px] text-neutral-400 ml-1">
                {product.variants[selectedVariantIndex]?.colorName}
              </span>
            </div>
          )}
        </div>

        {/* Pricing & Add to Cart button */}
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2 mt-auto">
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-bold text-neutral-950 tabular-nums">
              {formatPKR(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-neutral-400 line-through tabular-nums">
                {formatPKR(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, currentVariant.id, 1);
            }}
            className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium tracking-wider uppercase transition-colors flex items-center gap-1.5 shrink-0"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
