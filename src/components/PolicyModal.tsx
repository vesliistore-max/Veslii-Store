import React from 'react';
import { X, ShieldCheck, Truck, RotateCcw, HelpCircle, FileText, Info, Mail } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const PolicyModal: React.FC = () => {
  const { activePolicy, closePolicy } = useShop();

  if (!activePolicy) return null;

  const contentMap: Record<
    string,
    { title: string; subtitle: string; icon: React.ComponentType<{ className?: string }>; content: React.ReactNode }
  > = {
    shipping: {
      title: 'Shipping Policy',
      subtitle: 'Nationwide fulfillment across all Pakistani cities and regions',
      icon: Truck,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
          <p>
            At <strong>VESLII</strong>, all orders are processed with high-priority packaging from our central fulfillment hubs in Lahore and Islamabad.
          </p>
          <div className="p-4 bg-neutral-50 border border-neutral-200 space-y-2 text-neutral-800">
            <h4 className="font-semibold text-neutral-900">Delivery Timelines:</h4>
            <p>• <strong>Major Metros (Lahore, Karachi, Islamabad, Rawalpindi):</strong> 2 to 3 business days.</p>
            <p>• <strong>Other Cities & Regional Towns:</strong> 3 to 4 business days.</p>
            <p>• <strong>Express Dispatch:</strong> Orders placed before 3:00 PM PKT (Mon–Sat) are booked with the courier the same afternoon.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-neutral-900">Shipping Rates:</h4>
            <p>• <strong>Standard Nationwide Shipping:</strong> Flat Rs. 250.</p>
            <p>• <strong>Free Nationwide Shipping:</strong> Automatically applied on all cart subtotals of <strong>Rs. 4,999 and above</strong>.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-neutral-900">Payment Modes:</h4>
            <p>• <strong>Cash on Delivery (COD):</strong> Pay in cash to the courier representative upon doorstep handover.</p>
            <p>• <strong>Direct Online Bank Transfer:</strong> Instant account verification via Meezan Bank or HBL.</p>
          </div>
        </div>
      ),
    },
    returns: {
      title: 'Returns & Replacement Policy',
      subtitle: 'Our 7-day hassle-free replacement guarantee',
      icon: RotateCcw,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
          <p>
            We stand completely behind the horological precision of our watches, the leather grade of our wallets, and the purity of our serums.
          </p>
          <div className="p-4 bg-neutral-50 border border-neutral-200 space-y-2 text-neutral-800">
            <h4 className="font-semibold text-neutral-900">7-Day Replacement Guarantee:</h4>
            <p>• If you receive a product with any manufacturing defect, physical transit damage, or wrong variant, you may request a free replacement within 7 calendar days of delivery.</p>
            <p>• Items must be unwashed, unworn, and accompanied by the original VESLII presentation box, tags, and receipt card.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-neutral-900">1-Year Timepiece Warranty:</h4>
            <p>All VESLII watches include a complimentary 12-month internal mechanical/quartz movement warranty against precision loss or manufacturing defects.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-neutral-900">How to Initiate:</h4>
            <p>Send a WhatsApp message or email to <strong>vesliistore@gmail.com</strong> with your Order Number (e.g. VSL-PK-89241) and photos of the item. Our concierge will schedule a reverse pickup.</p>
          </div>
        </div>
      ),
    },
    faq: {
      title: 'Frequently Asked Questions',
      subtitle: 'Everything you need to know about VESLII products and ordering',
      icon: HelpCircle,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
          <div>
            <h4 className="font-semibold text-neutral-900 mb-1">Are your watches water-resistant?</h4>
            <p>Yes. All VESLII timepieces carry a 5 ATM water resistance rating, making them suitable for hand washing, perspiration, and rain exposure.</p>
          </div>
          <div>
            <h4 className="font-semibold text-neutral-900 mb-1">Is the leather in VESLII wallets real?</h4>
            <p>Absolutely. We use 100% full-grain and top-grain vegetable tanned cowhide. We never use PU, bonded leather, or synthetic microfibers.</p>
          </div>
          <div>
            <h4 className="font-semibold text-neutral-900 mb-1">Do your wallets block RFID card theft?</h4>
            <p>Yes. Every VESLII bifold and cardholder features a built-in aerospace-grade 13.56 MHz RFID electromagnetic blocking layer to protect your chip cards.</p>
          </div>
          <div>
            <h4 className="font-semibold text-neutral-900 mb-1">Are VESLII serums suitable for Pakistani weather?</h4>
            <p>Yes. Our formulations are water-gel based, non-comedogenic, and 100% fragrance-free, designed specifically to absorb rapidly without leaving greasy residue in humid or hot climates.</p>
          </div>
          <div>
            <h4 className="font-semibold text-neutral-900 mb-1">Can I inspect the parcel before paying Cash on Delivery?</h4>
            <p>Under standard courier policies in Pakistan (TCS, Trax, Leopard), the customer pays the rider before opening the exterior flyer. However, you are 100% covered by our 7-Day Doorstep Replacement Guarantee if anything is amiss.</p>
          </div>
        </div>
      ),
    },
    privacy: {
      title: 'Privacy Policy',
      subtitle: 'How we safeguard your personal information and transaction data',
      icon: ShieldCheck,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
          <p>
            VESLII respects your privacy. We strictly collect customer contact information (Name, Delivery Address, Phone Number, Email) solely for order processing, logistics dispatch, and customer service communication.
          </p>
          <p>
            • We never sell, rent, or trade your personal information with third-party marketing brokers.
          </p>
          <p>
            • Delivery details are shared strictly with our contracted courier partners solely for physical parcel handover.
          </p>
          <p>
            • For any data inquiry or removal request, email <strong>vesliistore@gmail.com</strong>.
          </p>
        </div>
      ),
    },
    terms: {
      title: 'Terms & Conditions',
      subtitle: 'Guidelines governing the use of the VESLII platform and purchases',
      icon: FileText,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
          <p>
            By placing an order on VESLII, you acknowledge and agree that:
          </p>
          <p>
            1. All prices are listed in Pakistani Rupees (PKR) and include all relevant sales duties.
          </p>
          <p>
            2. Product photographs represent actual physical inventory crafted under studio conditions. Minor leather grain variations reflect natural skin characteristics.
          </p>
          <p>
            3. In the event of an out-of-stock item after checkout, our team will contact you within 24 hours to offer an immediate alternative or cancellation.
          </p>
        </div>
      ),
    },
    about: {
      title: 'About VESLII',
      subtitle: 'Curated essentials for your everyday style',
      icon: Info,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
          <p>
            VESLII was established with a singular conviction: <strong>true luxury lies in restraint and enduring materials, not inflated price tags</strong>.
          </p>
          <p>
            For too long, discerning buyers in Pakistan had to choose between cheap disposable accessories or exorbitantly priced imported designer goods with 400% markups.
          </p>
          <p>
            VESLII engineers the middle ground: surgical-grade 316L stainless steel watches, vegetable-tanned full-grain leather wallets, and pure dermatological serums created with honest pricing, transparent specifications, and nationwide delivery.
          </p>
        </div>
      ),
    },
  };

  const active = contentMap[activePolicy] || contentMap.shipping;
  const Icon = active.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closePolicy}
      />

      <div className="relative min-h-screen sm:min-h-0 sm:my-16 max-w-2xl mx-auto bg-white shadow-2xl p-6 sm:p-10 animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={closePolicy}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100"
          aria-label="Close policy modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-neutral-100 rounded-full text-neutral-800">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
              VESLII POLICY & GOVERNANCE
            </span>
            <h3 className="text-xl sm:text-2xl font-serif text-neutral-900">
              {active.title}
            </h3>
          </div>
        </div>

        <p className="text-xs text-neutral-500 mb-6 pb-4 border-b border-neutral-100 font-light">
          {active.subtitle}
        </p>

        <div className="max-h-[60vh] overflow-y-auto pr-2">
          {active.content}
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <span>Need further assistance?</span>
          <a
            href="mailto:vesliistore@gmail.com"
            className="text-neutral-900 font-medium hover:underline inline-flex items-center gap-1"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>vesliistore@gmail.com</span>
          </a>
        </div>
      </div>
    </div>
  );
};
