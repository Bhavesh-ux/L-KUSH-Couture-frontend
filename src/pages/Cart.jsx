import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../components/cart/CartItem';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { formatPrice } from '../utils/formatters';
import { ShoppingBag, ArrowRight, ShieldCheck, Scissors, MessageSquare } from 'lucide-react';

export const Cart = () => {
  const { cart, subtotal, itemCount, clearCart } = useCart();
  const navigate = useNavigate();
  const [orderNote, setOrderNote] = useState('');

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your Atelier Bag is Empty"
          description="You currently have no garments in your shopping bag. Explore our royal sherwanis, festive kurtas, and Indo-Western bandhgalas."
          actionText="Browse Couture Catalogue"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between border-b border-neutral-200 pb-5">
        <div>
          <span className="text-xs uppercase tracking-widest text-luxury-gold-700 font-bold block mb-1">
            Bespoke Order Review
          </span>
          <h1 className="font-serif text-3xl font-bold text-neutral-900 tracking-tight">
            Shopping Bag ({itemCount} {itemCount === 1 ? 'Garment' : 'Garments'})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-neutral-500 hover:text-rose-600 uppercase tracking-wider font-semibold"
        >
          Clear Bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Cart Items List (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-neutral-200/90 p-6 sm:p-8 shadow-sm divide-y divide-neutral-100">
          {cart.map((item) => (
            <CartItem key={item.id} item={item} isCompact={false} />
          ))}

          {/* Special Tailoring Notes */}
          <div className="pt-6 mt-6">
            <label className="block uppercase tracking-wider font-semibold text-neutral-700 text-xs mb-2 flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-luxury-gold-600" />
              <span>Special Tailoring or Measurement Notes (Optional)</span>
            </label>
            <textarea
              rows={3}
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              placeholder="e.g., Preferred jacket sleeve length 25.5 inches; Chest 41 inches; Need delivery before April 10."
              className="w-full text-xs p-3 border border-neutral-300 focus:outline-none focus:border-luxury-gold-500 bg-luxury-cream-50/50"
            />
          </div>
        </div>

        {/* Order Summary & Concierge CTA (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-neutral-200/90 p-6 sm:p-8 shadow-sm space-y-6 sticky top-24">
          <h2 className="font-serif text-lg font-bold text-neutral-900 pb-3 border-b border-neutral-100">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Items Total ({itemCount})</span>
              <span className="font-semibold text-neutral-900">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Nationwide Insured Delivery</span>
              <span className="font-semibold text-emerald-700">Complimentary</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Master Tailoring Fitting Advice</span>
              <span className="font-semibold text-emerald-700">Complimentary</span>
            </div>

            <div className="border-t border-neutral-200 pt-3 flex justify-between items-baseline">
              <span className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                Estimated Total
              </span>
              <span className="text-xl font-bold text-neutral-900 font-sans">
                {formatPrice(subtotal)}
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-luxury-cream-50 border border-luxury-gold-300/40 text-[11px] text-neutral-600 space-y-1 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-neutral-900 uppercase tracking-wider">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Concierge Confirmation</span>
            </div>
            <p>
              Your order request will be sent to L-KUSH Couture on WhatsApp. The owner will review your measurements and contact you directly to confirm.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              variant="gold"
              size="lg"
              className="w-full"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate('/checkout', { state: { note: orderNote } })}
            >
              Proceed to Checkout
            </Button>

            <Link
              to="/shop"
              className="block text-center text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-luxury-gold-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
