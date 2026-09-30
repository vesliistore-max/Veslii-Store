import React, { useState } from 'react';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ChevronRight,
  Minus,
  Plus,
  Zap,
} from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { formatPKR, calculateDiscount } from '../utils/formatters';
import { ProductCard } from '../components/ProductCard';
import { ReviewsSection } from '../components/ReviewsSection';

interface ProductDetailPageProps {
  product: Product;
  onNavigate: (path: string) => void;
  onOpenProduct: (product: Product) => void;
  onProceedToCheckout: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onNavigate,
  onOpenProduct,
  onProceedToCheckout,
}) => {
  const { products, addToCart, toggleWishlist, isInWishlist, refreshProducts } = useShop();

  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping' | 'reviews' | 'faq'>('desc');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  const currentVariant = product.variants[selectedVariantIdx] || product.variants[0];
  const isWishlisted = isInWishlist(product.id);
  const discount = calculateDiscount(product.price, product.originalPrice);

  // Gallery images combined with variant images
  const allImages = React.useMemo(() => {
    const list = [...product.images];
    if (currentVariant?.image && !list.includes(currentVariant.image)) {
      list.unshift(currentVariant.image);
    }
    return list;
  }, [product, currentVariant]);

  const activeImage = allImages[selectedImageIdx] || allImages[0];

  const handleVariantChange = (idx: number) => {
    setSelectedVariantIdx(idx);
    const v = product.variants[idx];
    if (v && v.image) {
      const imgIdx = allImages.indexOf(v.image);
      if (imgIdx > -1) {
        setSelectedImageIdx(imgIdx);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleAddToCart = () => {
    addToCart(product, currentVariant.id, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, currentVariant.id, quantity);
    onProceedToCheckout();
  };

  const handleAddReview = async (reviewData: {
    author: string;
    city: string;
    rating: number;
    title: string;
    comment: string;
  }) => {
    const res = await fetch(`/api/reviews/${product.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });
    if (res.ok) {
      await refreshProducts();
    }
  };

  // Related products from the same category (excluding current)
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="w-full bg-[#FAFAFA] pb-24 sm:pb-32">
      {/* Breadcrumb Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-neutral-200/80">
        <ol className="flex items-center gap-2 text-xs text-neutral-500 uppercase tracking-widest font-medium">
          <li>
            <button onClick={() => onNavigate('/')} className="hover:text-black transition-colors">
              Home
            </button>
          </li>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <li>
            <button
              onClick={() => onNavigate(`/collections/${product.category}`)}
              className="hover:text-black transition-colors"
            >
              {product.category}
            </button>
          </li>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <li className="text-neutral-900 font-semibold truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Main PDP Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Product Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Clickable Thumbnails */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-20 shrink-0">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 border-2 overflow-hidden bg-neutral-100 transition-all ${
                    selectedImageIdx === idx
                      ? 'border-neutral-950 ring-1 ring-neutral-950'
                      : 'border-transparent hover:border-neutral-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                </button>
              ))}
            </div>

            {/* Main Image with Zoom */}
            <div
              className="relative aspect-4/3 flex-1 bg-neutral-100 overflow-hidden border border-neutral-200 cursor-crosshair"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={activeImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover object-center transition-transform duration-200 ${
                  isZoomed ? 'scale-150' : 'scale-100'
                }`}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      }
                    : undefined
                }
              />

              {discount && (
                <span className="absolute top-4 left-4 bg-neutral-950 text-white text-xs font-semibold tracking-wider uppercase px-2.5 py-1">
                  {discount}
                </span>
              )}

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-2.5 rounded-full transition-colors ${
                  isWishlisted
                    ? 'bg-neutral-950 text-white'
                    : 'bg-white/80 backdrop-blur-xs text-neutral-800 hover:bg-white hover:text-black'
                }`}
                aria-label="Wishlist toggle"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            {/* Category & Rating */}
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 mb-2 font-medium">
              <span>{product.category}</span>
              {product.rating > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  <div className="flex items-center gap-1 text-neutral-800">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="tabular-nums font-semibold">{product.rating}</span>
                    <span className="text-neutral-400">({product.reviewCount} reviews)</span>
                  </div>
                </>
              )}
            </div>

            {/* Product Title */}
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-neutral-950 mb-2 tracking-tight">
              {product.name}
            </h1>

            {/* Tagline */}
            <p className="text-xs sm:text-sm text-neutral-600 font-light mb-5">
              {product.tagline}
            </p>

            {/* Price block */}
            <div className="p-4 bg-white border border-neutral-200/80 mb-6">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-2xl sm:text-3xl font-bold text-neutral-950 tabular-nums">
                  {formatPKR(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-base text-neutral-400 line-through tabular-nums">
                    {formatPKR(product.originalPrice)}
                  </span>
                )}
                {discount && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 ml-auto">
                    Save {discount}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-500">
                Tax included. Eligible for Free Express Nationwide Delivery.
              </p>
            </div>

            {/* Variants Selector */}
            {product.variants.length > 1 && (
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-neutral-600 mb-2">
                  <span>Selected Variant:</span>
                  <strong className="text-neutral-900">{currentVariant?.name}</strong>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v, idx) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => handleVariantChange(idx)}
                      className={`flex items-center gap-2 px-3 py-2 border text-xs transition-all ${
                        selectedVariantIdx === idx
                          ? 'border-neutral-950 bg-neutral-950 text-white font-medium'
                          : 'border-neutral-300 bg-white text-neutral-800 hover:border-neutral-400'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-neutral-400"
                        style={{ backgroundColor: v.colorHex }}
                      />
                      <span>{v.colorName}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Inventory Stock Indicator */}
            <div className="mb-6 flex items-center gap-2 text-xs font-medium">
              {product.stock > 0 ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-emerald-800">
                    In Stock ({product.stock} units ready for immediate dispatch)
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-rose-700">Currently Sold Out</span>
                </>
              )}
            </div>

            {/* Quantity Selector & CTAs */}
            <div className="space-y-3 mb-8">
              <div className="flex gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-neutral-300 bg-white shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 sm:px-3 text-neutral-600 hover:bg-neutral-100 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-semibold tabular-nums text-neutral-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="p-2.5 sm:px-3 text-neutral-600 hover:bg-neutral-100 transition-colors disabled:opacity-30"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 py-3.5 px-6 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO CART</span>
                </button>
              </div>

              {/* Buy Now Button */}
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="w-full py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold tracking-[0.22em] uppercase transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
              >
                <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>BUY NOW WITH CASH ON DELIVERY</span>
              </button>
            </div>

            {/* Trust points banner */}
            <div className="p-4 bg-neutral-100/70 border border-neutral-200/60 divide-y divide-neutral-200 text-xs text-neutral-600 space-y-3">
              <div className="flex items-center gap-3 pt-1">
                <Truck className="w-4 h-4 text-neutral-900 shrink-0" />
                <span>Dispatches from Lahore within 24 hours · 2–3 Days Delivery</span>
              </div>
              <div className="flex items-center gap-3 pt-3">
                <RotateCcw className="w-4 h-4 text-neutral-900 shrink-0" />
                <span>7-Day Replacement Guarantee & 1-Year Timepiece Warranty</span>
              </div>
              <div className="flex items-center gap-3 pt-3">
                <ShieldCheck className="w-4 h-4 text-neutral-900 shrink-0" />
                <span>Verified genuine full-grain leather & surgical stainless steel</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed / Accordion Sections Below */}
        <div className="mt-16 sm:mt-24 pt-8 border-t border-neutral-200">
          {/* Tab Navigation */}
          <div className="flex border-b border-neutral-200 overflow-x-auto gap-4 sm:gap-8">
            {[
              { id: 'desc', label: 'DESCRIPTION' },
              { id: 'specs', label: 'SPECIFICATIONS' },
              { id: 'shipping', label: 'SHIPPING & RETURNS' },
              { id: 'reviews', label: `REVIEWS (${product.reviews?.length || 0})` },
              { id: 'faq', label: 'FAQS' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 text-xs font-semibold tracking-[0.2em] uppercase whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-neutral-950 text-neutral-950'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="py-8 text-neutral-700 leading-relaxed text-sm">
            {activeTab === 'desc' && (
              <div className="max-w-3xl space-y-4">
                <p className="text-base text-neutral-900 font-light leading-relaxed">
                  {product.description}
                </p>
                <div className="pt-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-3">
                    Craftsmanship Highlights:
                  </h4>
                  <ul className="space-y-2">
                    {product.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-neutral-600">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="max-w-2xl bg-white border border-neutral-200 divide-y divide-neutral-100">
                {product.specs.map((s, i) => (
                  <div key={i} className="py-3 px-4 flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-neutral-500 font-medium">{s.label}</span>
                    <span className="text-neutral-900 font-semibold text-right">{s.value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="max-w-2xl space-y-4 text-xs sm:text-sm text-neutral-600">
                <div className="p-4 bg-white border border-neutral-200 space-y-2">
                  <h4 className="font-semibold text-neutral-900">Delivery Information:</h4>
                  <p>• Major Cities (Lahore, Karachi, Islamabad): 2–3 Business Days.</p>
                  <p>• Other nationwide destinations: 3–4 Business Days.</p>
                  <p>• Free shipping on orders over Rs. 4,999; flat Rs. 250 otherwise.</p>
                  <p>• Cash on Delivery (COD) supported nationwide.</p>
                </div>
                <div className="p-4 bg-white border border-neutral-200 space-y-2">
                  <h4 className="font-semibold text-neutral-900">7-Day Replacement Guarantee:</h4>
                  <p>
                    If the item does not meet your standard or arrives with any defect, we replace it promptly without tedious questions.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <ReviewsSection
                  reviews={product.reviews || []}
                  productId={product.id}
                  onAddReview={handleAddReview}
                />
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="max-w-2xl space-y-4 text-xs sm:text-sm">
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-1">
                    Does this come with the official VESLII presentation box?
                  </h4>
                  <p className="text-neutral-600">
                    Yes. All timepieces, wallets, and serums are packaged in our custom matte black archival gift box, perfect for personal keeping or gifting.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-1">
                    How do I care for this product?
                  </h4>
                  <p className="text-neutral-600">
                    Keep leather goods away from excessive standing water; polish periodically with neutral leather balm. For watches, wipe sapphire glass with the microfiber cloth included in the box.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 sm:mt-24 pt-12 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[11px] font-semibold tracking-[0.25em] text-neutral-500 uppercase">
                  COMPLEMENTARY ARCHIVE
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-neutral-950 mt-1">
                  You May Also Like
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} onOpenProduct={onOpenProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile Add to Cart Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-neutral-200 p-3 sm:hidden z-30 flex items-center justify-between gap-3 shadow-lg">
        <div>
          <span className="text-xs font-bold text-neutral-950 block tabular-nums">
            {formatPKR(product.price)}
          </span>
          <span className="text-[10px] text-neutral-500 truncate max-w-[140px] block">
            {currentVariant?.name}
          </span>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 py-2.5 px-4 bg-neutral-950 text-white text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add to Bag</span>
        </button>
      </div>
    </div>
  );
};
