import React from 'react';
import { CheckCircle2, Truck, Package, Clock, ArrowRight, Printer, Copy, Check } from 'lucide-react';
import { Order } from '../types';
import { formatPKR } from '../utils/formatters';

interface OrderConfirmationPageProps {
  order: Order;
  onContinueShopping: () => void;
  onTrackOrder: (order: Order) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  onContinueShopping,
  onTrackOrder,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Banner */}
        <div className="text-center mb-8">
          <span className="font-brand text-3xl font-bold tracking-[0.28em] text-neutral-950 block mb-1">
            VESLII
          </span>
          <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 font-semibold">
            OFFICIAL ORDER CONFIRMATION
          </span>
        </div>

        {/* Success Card */}
        <div className="bg-white border border-neutral-200 shadow-xs p-6 sm:p-10 mb-8">
          <div className="flex flex-col items-center text-center pb-8 border-b border-neutral-200">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl text-neutral-950 mb-2">
              Thank You For Your Order
            </h1>

            <p className="text-xs sm:text-sm text-neutral-600 max-w-md font-light leading-relaxed">
              We have received your order and our workshop is preparing your shipment with meticulous care.
            </p>

            {/* Order Number pill */}
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 border border-neutral-200">
              <span className="text-xs uppercase tracking-wider text-neutral-500 font-medium">
                Order Reference:
              </span>
              <strong className="text-sm font-bold text-neutral-950 tracking-wider">
                {order.orderNumber}
              </strong>
              <button
                type="button"
                onClick={handleCopyOrderNumber}
                className="p-1 text-neutral-500 hover:text-black transition-colors"
                title="Copy order number"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Delivery Timeline estimate */}
          <div className="py-6 border-b border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-neutral-900 shrink-0" />
              <div>
                <span className="text-neutral-500 block uppercase tracking-wider text-[10px]">
                  Estimated Delivery Date
                </span>
                <span className="font-semibold text-neutral-900 text-sm">
                  {order.estimatedDelivery}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-neutral-900 shrink-0" />
              <div>
                <span className="text-neutral-500 block uppercase tracking-wider text-[10px]">
                  Fulfillment Status
                </span>
                <span className="font-semibold text-emerald-700 capitalize">
                  {order.status} · Preparing Dispatch
                </span>
              </div>
            </div>
          </div>

          {/* Bank Transfer Instructions (if bank transfer chosen) */}
          {order.paymentMethod === 'bank_transfer' && (
            <div className="my-6 p-5 bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-2">
              <h4 className="font-semibold text-amber-950 uppercase tracking-wider">
                Bank Transfer Instructions (Meezan Bank):
              </h4>
              <p>Please transfer <strong>{formatPKR(order.total)}</strong> to the following account:</p>
              <div className="p-3 bg-white border border-amber-200 font-mono space-y-1 text-xs">
                <p>Bank: <strong>Meezan Bank Limited</strong></p>
                <p>Account Title: <strong>VESLII LUXURY GOODS</strong></p>
                <p>Account Number: <strong>0201-0105829103</strong></p>
                <p>IBAN: <strong>PK44MEZN0002010105829103</strong></p>
                <p>Raast ID: <strong>03008472190</strong></p>
              </div>
              <p className="text-[11px] text-amber-800">
                After transfer, kindly share screenshot with your order number <strong>{order.orderNumber}</strong> to WhatsApp: <strong>+92 300 8472190</strong>.
              </p>
            </div>
          )}

          {/* Ordered Items Breakdown */}
          <div className="py-6 border-b border-neutral-200">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-4">
              Purchased Essentials ({order.items.length})
            </h3>
            <div className="divide-y divide-neutral-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-cover border border-neutral-200"
                    />
                    <div>
                      <h4 className="text-xs font-semibold text-neutral-900">{item.name}</h4>
                      <p className="text-[11px] text-neutral-500">{item.variantName}</p>
                      <p className="text-[10px] text-neutral-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-neutral-900 tabular-nums">
                    {formatPKR(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Totals */}
          <div className="py-6 border-b border-neutral-200 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span className="tabular-nums font-medium text-neutral-900">
                {formatPKR(order.subtotal)}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Discount ({order.couponCode || 'Promo'})</span>
                <span className="tabular-nums">-{formatPKR(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-600">
              <span>Nationwide Delivery</span>
              <span className="tabular-nums font-medium text-neutral-900">
                {order.shippingFee === 0 ? 'FREE' : formatPKR(order.shippingFee)}
              </span>
            </div>
            <div className="pt-2 border-t border-neutral-200 flex justify-between text-sm font-bold text-neutral-950">
              <span>Total Payable</span>
              <span className="tabular-nums text-base">{formatPKR(order.total)}</span>
            </div>
            <div className="pt-1 text-[11px] text-neutral-500 flex justify-between">
              <span>Payment Mode</span>
              <span className="uppercase font-semibold text-neutral-800">
                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Direct Bank Transfer'}
              </span>
            </div>
          </div>

          {/* Shipping Address Summary */}
          <div className="pt-6 text-xs text-neutral-600">
            <h4 className="font-semibold uppercase tracking-wider text-neutral-900 mb-2">
              Delivery Destination:
            </h4>
            <p className="font-medium text-neutral-900">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.address}</p>
            {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
            </p>
            <p className="mt-1 text-neutral-900">Contact: {order.shippingAddress.phone}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            type="button"
            onClick={() => onTrackOrder(order)}
            className="w-full sm:flex-1 py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>Track Order Package</span>
          </button>

          <button
            type="button"
            onClick={onContinueShopping}
            className="w-full sm:w-auto px-8 py-3.5 bg-white border border-neutral-300 hover:border-black text-neutral-900 text-xs font-semibold tracking-[0.2em] uppercase transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
