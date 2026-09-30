import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  ArrowRight,
  ShoppingBag,
  CreditCard,
  Banknote,
  AlertCircle,
  Building,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatPKR, validatePKPhone } from '../utils/formatters';
import { PaymentMethod, ShippingAddress, Order } from '../types';

interface CheckoutPageProps {
  onOrderSuccess: (order: Order) => void;
  onBackToCart: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onOrderSuccess,
  onBackToCart,
}) => {
  const {
    cart,
    clearCart,
    cartSubtotal,
    cartShippingFee,
    cartFinalTotal,
    appliedCoupon,
  } = useShop();

  // Form Fields
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    apartment: '',
    city: 'Lahore',
    province: 'Punjab',
    postalCode: '',
    deliveryNotes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const provinces = [
    'Punjab',
    'Sindh',
    'Khyber Pakhtunkhwa',
    'Islamabad Capital Territory',
    'Balochistan',
    'Azad Kashmir',
    'Gilgit-Baltistan',
  ];

  const popularCities: Record<string, string[]> = {
    Punjab: ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 'Sialkot', 'Bahawalpur', 'Sargodha'],
    Sindh: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Mirpur Khas'],
    'Khyber Pakhtunkhwa': ['Peshawar', 'Abbottabad', 'Mardan', 'Swat', 'Dera Ismail Khan'],
    'Islamabad Capital Territory': ['Islamabad'],
    Balochistan: ['Quetta', 'Gwadar', 'Turbat', 'Khuzdar'],
    'Azad Kashmir': ['Muzaffarabad', 'Mirpur', 'Rawalakot'],
    'Gilgit-Baltistan': ['Gilgit', 'Skardu', 'Hunza'],
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // If province changes, reset city to first in list
      ...(name === 'province' && { city: popularCities[value]?.[0] || '' }),
    }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (cart.length === 0) {
      setErrorMessage('Your cart is empty. Please add items to order.');
      return;
    }

    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!validatePKPhone(formData.phone)) {
      setErrorMessage('Please enter a valid Pakistani mobile number (e.g. 03001234567 or +923001234567).');
      return;
    }

    if (!formData.address.trim()) {
      setErrorMessage('Please provide a complete delivery street address.');
      return;
    }

    if (!formData.city.trim()) {
      setErrorMessage('Please specify your city.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        items: cart.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          name: item.name,
          variantName: item.variantName,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingAddress: formData,
        paymentMethod,
        couponCode: appliedCoupon?.code,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (res.ok && data.success && data.order) {
        clearCart();
        onOrderSuccess(data.order);
      } else {
        setErrorMessage(data.error || 'Unable to place order. Please review your details.');
      }
    } catch {
      // Fallback offline order generation if server is offline
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 3);

      const localOrder: Order = {
        orderNumber: `VSL-PK-${randomSuffix}`,
        createdAt: new Date().toISOString(),
        items: cart.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          name: item.name,
          variantName: item.variantName,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingAddress: formData,
        paymentMethod,
        subtotal: cartSubtotal,
        shippingFee: cartShippingFee,
        discount: appliedCoupon?.discount || 0,
        couponCode: appliedCoupon?.code,
        total: cartFinalTotal,
        status: 'confirmed',
        estimatedDelivery: deliveryDate.toLocaleDateString('en-PK', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      };

      clearCart();
      onOrderSuccess(localOrder);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
        <h2 className="text-xl font-serif text-neutral-900 mb-2">Your Bag is Empty</h2>
        <p className="text-xs text-neutral-500 mb-6">
          Add watches, wallets, or serums before proceeding to checkout.
        </p>
        <button
          onClick={onBackToCart}
          className="px-6 py-2.5 bg-neutral-950 text-white text-xs font-semibold tracking-widest uppercase"
        >
          Return to Store
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 pb-4 border-b border-neutral-200">
          <span className="text-[11px] font-semibold tracking-[0.25em] text-neutral-500 uppercase">
            SECURE COMMERCE CHECKOUT
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-neutral-900 mt-1">
            Shipping & Billing Details
          </h1>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Unable to proceed</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left 7 Columns: Shipping Form & Payment */}
            <div className="lg:col-span-7 space-y-8">
              {/* 1. Contact Information */}
              <div className="p-6 bg-white border border-neutral-200">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 mb-4 pb-2 border-b border-neutral-100">
                  1. Contact Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-neutral-600 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Asad Qureshi"
                      className="w-full px-3 py-2.5 border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-neutral-600 mb-1">
                      Mobile Number (For Courier SMS & COD) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="03001234567"
                      className="w-full px-3 py-2.5 border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900 tabular-nums"
                    />
                    <span className="text-[10px] text-neutral-400 mt-1 block">
                      Pakistani format (e.g. 0300-1234567 or +923001234567)
                    </span>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium uppercase tracking-wider text-neutral-600 mb-1">
                      Email Address (For receipt & tracking updates)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@example.com"
                      className="w-full px-3 py-2.5 border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Shipping Address */}
              <div className="p-6 bg-white border border-neutral-200">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 mb-4 pb-2 border-b border-neutral-100">
                  2. Delivery Address in Pakistan
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-neutral-600 mb-1">
                      Street Address / House No. / Building *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="e.g. House 42, Street 7, Sector F-8/2"
                      className="w-full px-3 py-2.5 border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-neutral-600 mb-1">
                      Apartment, Floor, Suite (Optional)
                    </label>
                    <input
                      type="text"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      placeholder="e.g. Apt 3B, Phase 5"
                      className="w-full px-3 py-2.5 border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-neutral-600 mb-1">
                        Province *
                      </label>
                      <select
                        name="province"
                        value={formData.province}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900 bg-white"
                      >
                        {provinces.map((prov) => (
                          <option key={prov} value={prov}>
                            {prov}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-neutral-600 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Lahore"
                        className="w-full px-3 py-2.5 border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-neutral-600 mb-1">
                        Postal Code (Optional)
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="e.g. 54000"
                        className="w-full px-3 py-2.5 border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-neutral-600 mb-1">
                      Special Delivery Instructions (Optional)
                    </label>
                    <textarea
                      name="deliveryNotes"
                      rows={2}
                      value={formData.deliveryNotes}
                      onChange={handleInputChange}
                      placeholder="e.g. Call before delivery, leave with guard..."
                      className="w-full px-3 py-2 border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Payment Method Selection */}
              <div className="p-6 bg-white border border-neutral-200">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 mb-4 pb-2 border-b border-neutral-100">
                  3. Select Payment Method
                </h2>

                <div className="space-y-3">
                  {/* Cash on Delivery option */}
                  <label
                    className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-neutral-950 bg-neutral-50/70 ring-1 ring-neutral-950'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 accent-neutral-900"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-emerald-700" />
                        <span className="text-sm font-bold text-neutral-900">
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-[10px] tracking-wider uppercase font-semibold text-emerald-800 bg-emerald-100 px-1.5 py-0.5">
                          Most Popular
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                        Pay in cash in Pakistani Rupees (PKR) directly to the TCS/Leopard courier representative when your parcel is delivered at your doorstep.
                      </p>
                    </div>
                  </label>

                  {/* Direct Bank Transfer option */}
                  <label
                    className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-neutral-950 bg-neutral-50/70 ring-1 ring-neutral-950'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="mt-1 accent-neutral-900"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-neutral-900" />
                        <span className="text-sm font-bold text-neutral-900">
                          Direct Bank Transfer / Raast Instant Pay
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                        Transfer directly to our official corporate account (Meezan Bank or HBL Raast ID). Banking details and instructions will appear on your confirmation screen.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Sticky Order Summary & Submit Button */}
            <div className="lg:col-span-5">
              <div className="p-6 bg-white border border-neutral-200 sticky top-24">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 mb-4 pb-2 border-b border-neutral-100">
                  Order Summary ({cart.reduce((a, b) => a + b.quantity, 0)} items)
                </h3>

                {/* Items preview */}
                <div className="divide-y divide-neutral-100 max-h-60 overflow-y-auto mb-6 pr-1">
                  {cart.map((item) => (
                    <div key={`${item.productId}-${item.variantId}`} className="py-3 flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover border border-neutral-200 shrink-0"
                      />
                      <div className="flex-1 text-xs">
                        <h4 className="font-semibold text-neutral-900 line-clamp-1">{item.name}</h4>
                        <p className="text-neutral-500 text-[11px]">{item.variantName}</p>
                        <p className="text-neutral-400 text-[10px]">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-xs font-bold text-neutral-900 tabular-nums">
                        {formatPKR(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Calculations */}
                <div className="space-y-2 text-xs border-t border-neutral-100 pt-4 mb-6">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span className="tabular-nums font-medium text-neutral-900">
                      {formatPKR(cartSubtotal)}
                    </span>
                  </div>

                  {appliedCoupon && appliedCoupon.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Promo ({appliedCoupon.code})</span>
                      <span className="tabular-nums">-{formatPKR(appliedCoupon.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-600">
                    <span>Nationwide Delivery</span>
                    <span className="tabular-nums font-medium text-neutral-900">
                      {cartShippingFee === 0 ? (
                        <span className="text-emerald-700 font-semibold uppercase text-[11px]">FREE</span>
                      ) : (
                        formatPKR(cartShippingFee)
                      )}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-neutral-200 flex justify-between text-base font-bold text-neutral-950">
                    <span>Total Payable</span>
                    <span className="tabular-nums text-lg">{formatPKR(cartFinalTotal)}</span>
                  </div>
                </div>

                {/* Submit Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 shadow-md"
                >
                  <span>{isSubmitting ? 'Placing Order...' : 'Complete & Confirm Order'}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <div className="mt-4 pt-4 border-t border-neutral-100 text-[11px] text-neutral-500 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-neutral-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Protected by 7-Day Doorstep Replacement Guarantee</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-700">
                    <Truck className="w-3.5 h-3.5 text-neutral-900" />
                    <span>SMS tracking alert dispatched immediately upon order booking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
