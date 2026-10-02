import React, { useEffect } from 'react';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { CartItem } from './CartItem';
import { Button } from '../common/Button';
import { formatPrice } from '../../utils/formatters';
import { Link, useNavigate } from 'react-router-dom';

export const CartDrawer = () => {
  const { cart, isCartDrawerOpen, setIsCartDrawerOpen, subtotal, itemCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (isCartDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartDrawerOpen]);

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-luxury-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-luxury-cream-50/70">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-luxury-gold-700" />
              <h2 className="font-serif text-lg font-bold text-neutral-900 tracking-tight">
                Your Atelier Cart
              </h2>
              <span className="text-xs bg-luxury-black text-luxury-gold-300 px-2 py-0.5 font-semibold">
                {itemCount}
              </span>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-14 h-14 rounded-full bg-luxury-cream-100 flex items-center justify-center text-luxury-gold-600 mb-3 border border-luxury-gold-200">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-base font-bold text-neutral-900 mb-1">
                  Your Cart is Empty
                </h3>
                <p className="text-xs text-neutral-500 mb-6 max-w-xs">
                  Discover handcrafted sherwanis, bandhgalas, and festive kurtas curated for grandeur.
                </p>
                <Button
                  variant="gold"
                  size="sm"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('/shop');
                  }}
                >
                  Explore Collection
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {cart.map((item) => (
                  <CartItem key={item.id} item={item} isCompact={true} />
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-neutral-200 bg-neutral-50 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  Subtotal (Estimated)
                </span>
                <span className="text-lg font-bold text-neutral-900 font-sans">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <p className="text-[11px] text-neutral-500 leading-snug">
                Orders are confirmed via direct WhatsApp concierge with our master tailoring specialist.
              </p>

              <div className="space-y-2 pt-1">
                <Button
                  variant="gold"
                  size="md"
                  className="w-full"
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('/checkout');
                  }}
                >
                  Proceed to Checkout
                </Button>

                <Link
                  to="/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="block text-center py-2 text-xs font-semibold uppercase tracking-wider text-neutral-700 hover:text-luxury-gold-700 transition-colors"
                >
                  View Full Bag & Fitting Notes
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
