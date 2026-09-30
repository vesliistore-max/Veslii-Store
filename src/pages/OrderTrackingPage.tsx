import React, { useState } from 'react';
import { Package, Truck, CheckCircle2, Clock, MapPin, ArrowLeft, Search } from 'lucide-react';
import { Order } from '../types';
import { formatPKR } from '../utils/formatters';

interface OrderTrackingPageProps {
  initialOrder: Order | null;
  onBackToHome: () => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  initialOrder,
  onBackToHome,
}) => {
  const [order, setOrder] = useState<Order | null>(initialOrder);
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${searchInput.trim().toUpperCase()}`);
      const data = await res.json();
      if (res.ok && data.order) {
        setOrder(data.order);
      } else {
        setError(data.error || 'No order found with this tracking ID.');
      }
    } catch {
      setError('Unable to load order tracking details.');
    } finally {
      setLoading(false);
    }
  };

  const stages = [
    { title: 'Order Confirmed', desc: 'Verified and queued for workshop packaging', completed: true },
    { title: 'Quality Bench Inspection', desc: 'Precision examination and dust-free sealing', completed: true },
    { title: 'Express Courier Dispatch', desc: 'Dispatched via Express Courier with live tracking', completed: true },
    { title: 'Out For Delivery', desc: 'Courier agent en route to recipient doorstep', completed: false },
    { title: 'Delivered & Handed Over', desc: 'Payment received & customer handed parcel', completed: false },
  ];

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-10 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 hover:text-black mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Store</span>
        </button>

        {/* Tracking Search Header */}
        <div className="bg-white border border-neutral-200 p-6 mb-8 shadow-xs">
          <span className="text-[11px] font-semibold tracking-[0.25em] text-neutral-500 uppercase block mb-1">
            VESLII LOGISTICS & DISPATCH
          </span>
          <h1 className="text-xl sm:text-2xl font-serif text-neutral-900 mb-4">
            Live Order Tracking Portal
          </h1>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter Order Number (e.g. VSL-PK-89241)"
              className="flex-1 px-4 py-2.5 border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900 uppercase tracking-wider"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-neutral-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{loading ? 'Searching...' : 'Track'}</span>
            </button>
          </form>

          {error && (
            <p className="mt-3 text-xs text-rose-600 font-medium">{error}</p>
          )}
        </div>

        {order ? (
          <div className="space-y-8">
            {/* Order status card */}
            <div className="bg-white border border-neutral-200 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
                <div>
                  <span className="text-xs text-neutral-400 uppercase tracking-wider block">
                    Tracking Identifier
                  </span>
                  <span className="text-lg font-bold text-neutral-950 tracking-wider">
                    {order.orderNumber}
                  </span>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-neutral-400 uppercase tracking-wider block">
                    Estimated Doorstep Delivery
                  </span>
                  <span className="text-sm font-semibold text-neutral-900">
                    {order.estimatedDelivery}
                  </span>
                </div>
              </div>

              {/* Visual Stages Progress Timeline */}
              <div className="py-8">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-6">
                  Shipment Progression
                </h3>

                <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-neutral-200">
                  {stages.map((stage, idx) => (
                    <div key={idx} className="relative flex items-start gap-4">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${
                          stage.completed
                            ? 'bg-neutral-950 text-white'
                            : 'bg-white border-2 border-neutral-300 text-neutral-400'
                        }`}
                      >
                        {stage.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <span className="text-[10px] font-bold">{idx + 1}</span>
                        )}
                      </div>
                      <div className="pt-0.5">
                        <h4
                          className={`text-xs font-semibold uppercase tracking-wider ${
                            stage.completed ? 'text-neutral-900' : 'text-neutral-400'
                          }`}
                        >
                          {stage.title}
                        </h4>
                        <p className="text-xs text-neutral-500 font-light mt-0.5">
                          {stage.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Details */}
              <div className="pt-6 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-neutral-400 uppercase tracking-wider block mb-1">
                    Recipient & Address
                  </span>
                  <p className="font-semibold text-neutral-900">{order.shippingAddress.fullName}</p>
                  <p className="text-neutral-600">{order.shippingAddress.address}</p>
                  <p className="text-neutral-600">{order.shippingAddress.city}, {order.shippingAddress.province}</p>
                  <p className="text-neutral-600">Contact: {order.shippingAddress.phone}</p>
                </div>

                <div>
                  <span className="text-neutral-400 uppercase tracking-wider block mb-1">
                    Financial Summary
                  </span>
                  <p className="text-neutral-600">Total Payable: <strong className="text-neutral-900">{formatPKR(order.total)}</strong></p>
                  <p className="text-neutral-600">
                    Payment Method: <span className="uppercase font-medium">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Direct Bank Transfer'}</span>
                  </p>
                  <p className="text-neutral-600">Items: {order.items.length} product(s)</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center bg-white border border-neutral-200">
            <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-neutral-900 mb-1">
              Enter an order number to begin tracking
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              You can find your order reference in the confirmation screen or in the SMS alert sent to your mobile.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
