import React, { useState } from 'react';
import { X, Package, ShieldCheck, Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Order } from '../types';

interface AccountModalProps {
  onOrderFound: (order: Order) => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ onOrderFound }) => {
  const { isAccountOpen, closeAccount, showNotification } = useShop();
  const [activeTab, setActiveTab] = useState<'track' | 'login'>('track');
  const [orderNumberInput, setOrderNumberInput] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  // Login form state
  const [emailInput, setEmailInput] = useState('');
  const [loggedInUser, setLoggedInUser] = useState<string | null>(() => {
    try {
      return localStorage.getItem('veslii_customer_email');
    } catch {
      return null;
    }
  });

  if (!isAccountOpen) return null;

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumberInput.trim()) return;

    setTrackingLoading(true);
    setTrackingError(null);

    try {
      const cleanNum = orderNumberInput.trim().toUpperCase();
      const res = await fetch(`/api/orders/${cleanNum}`);
      const data = await res.json();

      if (res.ok && data.order) {
        closeAccount();
        onOrderFound(data.order);
      } else {
        setTrackingError(data.error || 'Order not found. Please verify the order number (e.g. VSL-PK-89241).');
      }
    } catch {
      setTrackingError('Unable to connect to order tracking service. Please try again.');
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) return;

    localStorage.setItem('veslii_customer_email', emailInput);
    setLoggedInUser(emailInput);
    showNotification(`Welcome back, ${emailInput}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('veslii_customer_email');
    setLoggedInUser(null);
    showNotification('Signed out from account.');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeAccount}
      />

      <div className="relative min-h-screen sm:min-h-0 sm:my-16 max-w-md mx-auto bg-white shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={closeAccount}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab switch */}
        <div className="flex border-b border-neutral-200 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('track')}
            className={`flex-1 py-3 text-xs font-semibold tracking-wider uppercase border-b-2 transition-colors ${
              activeTab === 'track'
                ? 'border-neutral-950 text-neutral-950'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Track Order
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 text-xs font-semibold tracking-wider uppercase border-b-2 transition-colors ${
              activeTab === 'login'
                ? 'border-neutral-950 text-neutral-950'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Customer Account
          </button>
        </div>

        {activeTab === 'track' ? (
          <div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3 text-neutral-800">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif text-neutral-900">
                Live Order Tracking
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Enter your genuine order confirmation number to check packaging, dispatch, and delivery stages.
              </p>
            </div>

            <form onSubmit={handleTrackOrder} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1 font-medium">
                  Order Number
                </label>
                <input
                  type="text"
                  required
                  value={orderNumberInput}
                  onChange={(e) => setOrderNumberInput(e.target.value)}
                  placeholder="e.g. VSL-PK-89241"
                  className="w-full px-3 py-2.5 border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900 uppercase tracking-wider"
                />
              </div>

              {trackingError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs leading-relaxed">
                  {trackingError}
                </div>
              )}

              <button
                type="submit"
                disabled={trackingLoading}
                className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold tracking-widest uppercase transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{trackingLoading ? 'Locating Package...' : 'Track My Order'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-neutral-100 text-xs text-neutral-500 space-y-2">
              <div className="flex items-center gap-2 text-neutral-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>VESLII Guaranteed Delivery</span>
              </div>
              <p>
                All orders are dispatched via express courier with real-time SMS tracking updates on your phone.
              </p>
            </div>
          </div>
        ) : (
          <div>
            {loggedInUser ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-neutral-900">
                    VESLII VIP Member
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">{loggedInUser}</p>
                </div>
                <div className="p-4 bg-neutral-50 border border-neutral-200 text-xs text-left space-y-2">
                  <p className="font-semibold text-neutral-900">Your VIP Privileges:</p>
                  <p>✓ Priority fulfillment on limited watch batches</p>
                  <p>✓ Lifetime 10% loyalty discount code: <strong>VESLII10</strong></p>
                  <p>✓ Direct WhatsApp concierge assistance</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2.5 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider hover:bg-neutral-100 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3 text-neutral-800">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-serif text-neutral-900">
                    Customer Sign In
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Access your order history, saved addresses, and member benefits.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1 font-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="e.g. name@example.com"
                      className="w-full px-3 py-2.5 border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold tracking-widest uppercase transition-colors"
                  >
                    Continue with Email
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
