
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.jpg';
import { MessageSquare, ShieldCheck, Send } from 'lucide-react';
import { openWhatsAppCustom } from '../../utils/whatsapp';
import { useToast } from '../common/Toast';

export const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const { addToast } = useToast();

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    addToast('Thank you for subscribing to L-KUSH Couture privates.', 'success');
    setNewsletterEmail('');
  };

  const handleConciergeChat = () => {
    openWhatsAppCustom(
      "Hello L-KUSH Couture, I would like to consult with your stylist regarding bespoke sizing and upcoming collections."
    );
  };

  return (
    <footer className="bg-luxury-black text-luxury-cream-100 border-t border-luxury-gold-500/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12 border-b border-neutral-800 text-center md:text-left">

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-luxury-charcoal flex items-center justify-center text-luxury-gold-400 border border-luxury-gold-500/30 shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>

            <div>
              <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
                Direct WhatsApp Concierge
              </h4>

              <p className="text-xs text-neutral-400 mt-1">
                Personalized fitting assistance with our master artisans.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-luxury-charcoal flex items-center justify-center text-luxury-gold-400 border border-luxury-gold-500/30 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div>
              <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
                Authentic Indian Craftsmanship
              </h4>

              <p className="text-xs text-neutral-400 mt-1">
                Pure mulberry silks, zardozi hand embroidery & bespoke cuts.
              </p>
            </div>
          </div>

        </div>

        {/* Main Footer Directory */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-12 border-b border-neutral-800">

          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <img
                src={logoImg}
                alt="L-KUSH Couture"
                className="h-14 w-auto object-contain"
              />
            </Link>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              L-KUSH Couture presents modern Indian luxury menswear and festive
              couture. Combining traditional hand embroidery with contemporary
              tailoring for monumental celebrations.
            </p>

            <div className="pt-2">
              <button
                onClick={handleConciergeChat}
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-luxury-gold-500/40 text-luxury-gold-400 text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Collections Column */}
          <div>
            <h5 className="font-serif text-xs font-bold uppercase tracking-widest text-luxury-gold-400 mb-4">
              Couture Collections
            </h5>

            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link
                  to="/category/sherwani"
                  className="hover:text-white transition-colors"
                >
                  Royal Sherwanis
                </Link>
              </li>

              <li>
                <Link
                  to="/category/indo-western"
                  className="hover:text-white transition-colors"
                >
                  Indo-Western Sets
                </Link>
              </li>

              <li>
                <Link
                  to="/category/kurta-pajama"
                  className="hover:text-white transition-colors"
                >
                  Kurta Pajama Sets
                </Link>
              </li>

              <li>
                <Link
                  to="/category/wedding"
                  className="hover:text-white transition-colors"
                >
                  Wedding Groom Ensembles
                </Link>
              </li>

              <li>
                <Link
                  to="/category/blazer"
                  className="hover:text-white transition-colors"
                >
                  Bandhgalas & Blazers
                </Link>
              </li>

              <li>
                <Link
                  to="/trending"
                  className="hover:text-white transition-colors"
                >
                  Trending Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div>
            <h5 className="font-serif text-xs font-bold uppercase tracking-widest text-luxury-gold-400 mb-4">
              Client Care
            </h5>

            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link
                  to="/orders"
                  className="hover:text-white transition-colors"
                >
                  Order Concierge Tracking
                </Link>
              </li>

              <li>
                <Link
                  to="/wishlist"
                  className="hover:text-white transition-colors"
                >
                  Private Wishlist
                </Link>
              </li>

              <li>
                <Link
                  to="/profile"
                  className="hover:text-white transition-colors"
                >
                  Profile & Measurements
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h5 className="font-serif text-xs font-bold uppercase tracking-widest text-luxury-gold-400 mb-4">
              Private Dispatch
            </h5>

            <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
              Subscribe to receive exclusive seasonal previews and private
              previews of new couture releases.
            </p>

            <form onSubmit={handleNewsletter} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="w-full bg-neutral-900 border border-neutral-700 py-2 pl-3 pr-9 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-luxury-gold-500"
                />

                <button
                  type="submit"
                  className="absolute right-2 top-2 text-luxury-gold-400 hover:text-luxury-gold-300"
                  aria-label="Subscribe"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Bottom Credits & Owner Portal Access */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-4">

          <p>
            © {new Date().getFullYear()} L-KUSH Couture. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <span>Handcrafted Indian Couture</span>

            {/* Owner portal access */}
            <Link
              to="/admin/login"
              className="text-neutral-500 hover:text-luxury-gold-400 transition-colors uppercase tracking-widest font-medium"
            >
              Owner Portal
            </Link>
          </div>

        </div>

      </div>
    </footer>
  );
};
