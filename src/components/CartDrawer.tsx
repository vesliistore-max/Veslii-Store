import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, Check, Truck } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatPKR } from '../utils/formatters';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onProceedToCheckout,
  onContinueShopping,
}) => {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    cartShippingFee,
    cartFinalTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setApplying(true);
    setCouponError(null);

    const res = await applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
    setApplying(false);
  };

  const freeShippingThreshold = 4999;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-neutral-900" />
              <h2 className="text-base font-semibold tracking-wider uppercase text-neutral-900">
                Shopping Bag ({cart.reduce((a, b) => a + b.quantity, 0)})
              </h2>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="p-1.5 text-neutral-400 hover:text-black transition-colors rounded-full hover:bg-neutral-100"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free shipping progress bar */}
          <div className="px-5 sm:px-6 py-3 bg-neutral-50 border-b border-neutral-100 text-xs">
            <div className="flex items-center justify-between mb-1.5 font-medium text-neutral-700">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                {remainingForFreeShipping > 0 ? (
                  <span>
                    Add <strong>{formatPKR(remainingForFreeShipping)}</strong> more for FREE shipping
                  </span>
                ) : (
                  <span className="text-emerald-700 font-semibold">
                    You have unlocked FREE nationwide delivery!
                  </span>
                )}
              </span>
              <span className="tabular-nums font-semibold">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-200 overflow-hidden rounded-full">
              <div
                className="h-full bg-neutral-900 transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 divide-y divide-neutral-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <ShoppingBag className="w-12 h-12 text-neutral-300 mb-4" />
                <h3 className="text-base font-semibold text-neutral-900 mb-1">
                  Your shopping bag is empty
                </h3>
                <p className="text-xs text-neutral-500 max-w-xs mb-6">
                  Discover our curated timepieces, full-grain leather goods, and clinical serums.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    closeCart();
                    onContinueShopping();
                  }}
                  className="px-6 py-2.5 bg-neutral-950 text-white text-xs font-semibold tracking-widest uppercase hover:bg-neutral-800 transition-colors"
                >
                  Shop Best Sellers
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={`${item.productId}-${item.variantId}`} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-neutral-100 shrink-0 overflow-hidden border border-neutral-200/80">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-neutral-900 line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.productId, item.variantId)}
                          className="text-neutral-400 hover:text-rose-600 transition-colors p-0.5"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        {item.variantName || item.colorName}
                      </p>

                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-xs font-bold text-neutral-900 tabular-nums">
                          {formatPKR(item.price)}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-[10px] text-neutral-400 line-through tabular-nums">
                            {formatPKR(item.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity stepper */}
                    <div className="flex items-center justify-between mt-3 pt-2">
                      <div className="flex items-center border border-neutral-300">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                          className="p-1 hover:bg-neutral-100 transition-colors text-neutral-600"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-neutral-900 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="p-1 hover:bg-neutral-100 transition-colors text-neutral-600 disabled:opacity-30"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-neutral-900 tabular-nums">
                        {formatPKR(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions & Summary */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 bg-neutral-50 border-t border-neutral-200">
              {/* Promo code */}
              <div className="mb-4">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Code <strong>{appliedCoupon.code}</strong> applied</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-neutral-500 hover:text-neutral-900 text-[11px] underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Promo code (e.g. VESLII10)"
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-neutral-300 focus:outline-none focus:border-neutral-900 uppercase"
                    />
                    <button
                      type="submit"
                      disabled={applying}
                      className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>
                )}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-1.5 text-xs mb-4">
                <div className="flex items-center justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-medium text-neutral-900">
                    {formatPKR(cartSubtotal)}
                  </span>
                </div>

                {appliedCoupon && appliedCoupon.discount > 0 && (
                  <div className="flex items-center justify-between text-emerald-700 font-medium">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span className="tabular-nums">-{formatPKR(appliedCoupon.discount)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-neutral-600">
                  <span>Nationwide Shipping</span>
                  <span className="tabular-nums font-medium text-neutral-900">
                    {cartShippingFee === 0 ? (
                      <span className="text-emerald-700 font-semibold uppercase text-[11px]">FREE</span>
                    ) : (
                      formatPKR(cartShippingFee)
                    )}
                  </span>
                </div>

                <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-sm font-bold text-neutral-950">
                  <span>Total Payable</span>
                  <span className="tabular-nums text-base">{formatPKR(cartFinalTotal)}</span>
                </div>
                <p className="text-[10px] text-neutral-500 pt-0.5">
                  Includes applicable sales tax & delivery charges.
                </p>
              </div>

              {/* Checkout and Continue Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    closeCart();
                    onProceedToCheckout();
                  }}
                  className="w-full py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2 group"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    closeCart();
                    onContinueShopping();
                  }}
                  className="w-full py-2.5 text-center text-xs text-neutral-600 hover:text-black tracking-wider uppercase transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
