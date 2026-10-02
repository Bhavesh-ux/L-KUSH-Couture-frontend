
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { formatPrice } from '../utils/formatters';
import { openWhatsApp } from '../utils/whatsapp';
import { Button } from '../components/common/Button';
import { trackEvent } from '../utils/analytics';
import {
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, subtotal, itemCount, clearCart } = useCart();
  const { customer } = useAuth();

  const [formData, setFormData] = useState({
    name: customer?.name || '',
    phone: customer?.phone || '',
    email: customer?.email || '',
    address: customer?.address || '',
    city: customer?.city || '',
    state: customer?.state || '',
    pincode: customer?.pincode || '',
    note: location.state?.note || '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Track checkout started
  useEffect(() => {
    if (cart.length > 0) {
      trackEvent('checkout_started', {
        itemCount,
        totalAmount: subtotal,
      });
    }
  }, [cart.length, itemCount, subtotal]);

  if (cart.length === 0 && !isSubmitted) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-2">
          Your Cart is Empty
        </h2>

        <p className="text-xs text-neutral-500 mb-6">
          Please add garments to your bag before proceeding to checkout.
        </p>

        <Link to="/shop">
          <Button variant="gold" size="md">
            Browse Collections
          </Button>
        </Link>
      </div>
    );
  }

  const handleWhatsAppConfirm = async (e) => {
    e.preventDefault();
    setError('');

    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim()
    ) {
      setError('Please complete all required shipping fields.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create order in backend
      const newOrder = await orderService.createOrder({
        customerName: formData.name.trim(),

        customerPhone: formData.phone.trim(),

        customerEmail:
          formData.email.trim() ||
          customer?.email ||
          'guest@example.com',

        shippingAddress: {
          address: formData.address.trim(),
          city: formData.city.trim() || 'N/A',
          state: formData.state.trim() || 'N/A',
          pincode: formData.pincode.trim() || 'N/A',
        },

        items: cart.map((item) => ({
          id: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.image,
        })),

        totalAmount: subtotal,

        note: formData.note.trim(),
      });

      // 2. Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#c5a059', '#e6c875', '#17171a'],
        });
      } catch {
        // Safe fallback
      }

      // 3. Open WhatsApp
      openWhatsApp(newOrder);

      // 4. Update UI
      setCreatedOrder(newOrder);
      setIsSubmitted(true);

      // 5. Clear cart
      clearCart();
    } catch (err) {
      console.error('Error creating order:', err);

      setError(
        err.message ||
          'Failed to submit order request. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (isSubmitted && createdOrder) {
    const orderReference =
      createdOrder.order_number || createdOrder.id;

    const displayStatus =
      createdOrder.status === 'pending'
        ? 'Pending Confirmation'
        : createdOrder.status || 'Pending Confirmation';

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white border border-neutral-200/90 shadow-luxury p-8 sm:p-12 text-center space-y-6">

          {/* Success Icon */}
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-luxury-gold-700 font-bold block">
              Concierge Request Initiated
            </span>

            <h1 className="font-serif text-3xl font-bold text-neutral-900 tracking-tight">
              Thank You For Your Order
            </h1>

            <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
              Your order request for reference{' '}
              <strong className="text-neutral-900">
                {orderReference}
              </strong>{' '}
              has been prepared and transmitted to L-KUSH Couture via WhatsApp.
            </p>
          </div>

          {/* Order Information */}
          <div className="p-4 sm:p-6 bg-luxury-cream-50 border border-luxury-gold-300/40 text-left text-xs space-y-3 max-w-xl mx-auto">

            {/* Order Reference */}
            <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
              <span className="font-semibold text-neutral-700">
                Order Reference:
              </span>

              <span className="font-bold text-neutral-900 font-sans">
                {orderReference}
              </span>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
              <span className="font-semibold text-neutral-700">
                Total Valuation:
              </span>

              <span className="font-bold text-neutral-900 font-sans">
                {formatPrice(createdOrder.totalAmount)}
              </span>
            </div>

            {/* Initial Status */}
            <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
              <span className="font-semibold text-neutral-700">
                Initial Status:
              </span>

              <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200">
                {displayStatus}
              </span>
            </div>

            {/* Explanation */}
            <p className="text-neutral-500 text-[11px] pt-1 leading-snug">
              Our master tailoring specialist will review your fabric
              selection, confirm measurement specifications, and coordinate
              delivery directly on your WhatsApp chat.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">

            <button
              onClick={() => openWhatsApp(createdOrder)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-xs inline-flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Re-open WhatsApp Chat</span>
            </button>

            <Link to="/orders">
              <Button
                variant="dark"
                size="md"
                className="w-full sm:w-auto"
              >
                Track in My Orders
              </Button>
            </Link>

            <Link to="/shop">
              <Button
                variant="outline"
                size="md"
                className="w-full sm:w-auto"
              >
                Return to Shop
              </Button>
            </Link>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">

      {/* Header */}
      <div className="border-b border-neutral-200 pb-5">
        <span className="text-xs uppercase tracking-widest text-luxury-gold-700 font-bold block mb-1">
          Bespoke Checkout & Concierge
        </span>

        <h1 className="font-serif text-3xl font-bold text-neutral-900 tracking-tight">
          Delivery Details & Order Review
        </h1>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-xs text-rose-700 leading-snug">
          {error}
        </div>
      )}

      <form
        onSubmit={handleWhatsAppConfirm}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
      >

        {/* LEFT — Shipping Details */}
        <div className="lg:col-span-7 bg-white border border-neutral-200/90 p-6 sm:p-8 shadow-sm space-y-5 text-xs">

          <h2 className="font-serif text-lg font-bold text-neutral-900 pb-3 border-b border-neutral-100 flex items-center justify-between">
            <span>Client & Shipping Coordinates</span>

            <span className="text-[11px] font-normal text-neutral-500 font-sans">
              No online payment required
            </span>
          </h2>

          {/* Name + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                Full Name *
              </label>

              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                placeholder="e.g. Vikramaditya Singhania"
                className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-luxury-gold-500"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                WhatsApp Phone Number *
              </label>

              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value,
                  })
                }
                placeholder="+91 98765 43210"
                className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-luxury-gold-500"
              />
            </div>

          </div>

          {/* Email */}
          <div>
            <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
              Email Address (For Invoicing)
            </label>

            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              placeholder="patron@example.com"
              className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-luxury-gold-500"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
              Complete Delivery Address *
            </label>

            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: e.target.value,
                })
              }
              placeholder="Flat/House No., Building, Street Name, Area"
              className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-luxury-gold-500"
            />
          </div>

          {/* City / State / Pincode */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <div>
              <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                City *
              </label>

              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    city: e.target.value,
                  })
                }
                placeholder="e.g. Mumbai"
                className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-luxury-gold-500"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                State *
              </label>

              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    state: e.target.value,
                  })
                }
                placeholder="e.g. Maharashtra"
                className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-luxury-gold-500"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                Pincode *
              </label>

              <input
                type="text"
                required
                value={formData.pincode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pincode: e.target.value,
                  })
                }
                placeholder="e.g. 400001"
                className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-luxury-gold-500"
              />
            </div>

          </div>

          {/* Tailoring Note */}
          <div>
            <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
              Custom Tailoring / Fit Instructions (Optional)
            </label>

            <textarea
              rows={3}
              value={formData.note}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  note: e.target.value,
                })
              }
              placeholder="Mention chest, waist, or sleeve custom specifications here..."
              className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-luxury-gold-500 bg-luxury-cream-50/50"
            />
          </div>

        </div>

        {/* RIGHT — Order Summary */}
        <div className="lg:col-span-5 space-y-6">

          <div className="bg-white border border-neutral-200/90 p-6 sm:p-8 shadow-sm space-y-4">

            <h2 className="font-serif text-lg font-bold text-neutral-900 pb-3 border-b border-neutral-100 flex items-center justify-between">
              <span>Order Summary</span>

              <span className="text-xs text-luxury-gold-700 font-bold">
                {itemCount} Ensembles
              </span>
            </h2>

            {/* Items */}
            <div className="divide-y divide-neutral-100 max-h-64 overflow-y-auto pr-1">

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="py-2.5 flex items-center gap-3 text-xs"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-16 object-cover object-top border shrink-0"
                  />

                  <div className="flex-1 min-w-0">

                    <p className="font-serif font-bold text-neutral-900 truncate">
                      {item.name}
                    </p>

                    <p className="text-[11px] text-neutral-500">
                      Size: {item.size} | Color: {item.color} | Qty:{' '}
                      {item.quantity}
                    </p>

                  </div>

                  <span className="font-bold text-neutral-900 font-sans shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}

            </div>

            {/* Totals */}
            <div className="border-t border-neutral-200 pt-3 space-y-2 text-xs">

              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>

                <span className="font-semibold text-neutral-900 font-sans">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-neutral-600">
                <span>Insured Nationwide Delivery</span>

                <span className="font-semibold text-emerald-700">
                  Complimentary
                </span>
              </div>

              <div className="border-t border-neutral-200 pt-2 flex justify-between items-baseline">

                <span className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                  Total Payable
                </span>

                <span className="text-2xl font-bold text-neutral-900 font-sans">
                  {formatPrice(subtotal)}
                </span>

              </div>

            </div>

            {/* Explanation */}
            <div className="p-4 bg-luxury-cream-50 border border-luxury-gold-300/40 text-[11px] text-neutral-700 leading-relaxed space-y-2">

              <div className="flex items-center gap-1.5 font-bold text-neutral-900 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-luxury-gold-600" />
                <span>How Concierge Ordering Works</span>
              </div>

              <p>
                Your order request will be sent to L-KUSH Couture on WhatsApp.
                The owner will contact you to confirm the order, review your
                measurements, and finalize payment directly.
              </p>

            </div>

            {/* Confirm Button */}
            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full text-xs"
              loading={loading}
              icon={MessageSquare}
            >
              Confirm Order on WhatsApp
            </Button>

          </div>

        </div>
      </form>
    </div>
  );
};
