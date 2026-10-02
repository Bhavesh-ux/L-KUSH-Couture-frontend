
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Eye,
  ShoppingBag,
  Star
} from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../common/Toast';

export const ProductCard = ({ product, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);

  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const isFavorited = isInWishlist(product.id);

  const primaryImg = product.images[0];
  const secondaryImg = product.images[1] || product.images[0];

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    toggleWishlist(product);

    addToast(
      isFavorited
        ? `Removed ${product.name} from Wishlist`
        : `Added ${product.name} to Wishlist`,
      'success'
    );
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(
      product,
      product.sizes?.[0] || '40',
      product.colors?.[0]?.name,
      1
    );

    addToast(
      `Added ${product.name} to Cart`,
      'success'
    );
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <div
      className="group relative flex flex-col bg-white border border-neutral-200/80 transition-all duration-300 hover:shadow-luxury hover:border-luxury-gold-500/40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Aspect Ratio */}
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">

        <Link
          to={`/product/${product.id}`}
          className="block w-full h-full"
        >
          <img
            src={isHovered ? secondaryImg : primaryImg}
            alt={product.name}
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">

          {product.newArrival && (
            <span className="bg-luxury-black/90 text-luxury-gold-300 border border-luxury-gold-500/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
              New Arrival
            </span>
          )}

          {product.discount > 0 && (
            <span className="bg-luxury-gold-500 text-luxury-black font-bold px-2 py-0.5 text-[10px] uppercase tracking-wider">
              {product.discount}% Off
            </span>
          )}

        </div>

        {/* Action Buttons Top-Right */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">

          <button
            onClick={handleWishlistClick}
            aria-label="Wishlist"
            className={`p-2 transition-all duration-200 ${
              isFavorited
                ? 'bg-rose-50 text-rose-600 shadow-sm'
                : 'bg-white/90 text-neutral-700 hover:text-rose-600 hover:bg-white shadow-sm'
            }`}
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorited ? 'fill-current' : ''
              }`}
            />
          </button>

        </div>

        {/* Hover Quick Actions Drawer (Desktop) */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-luxury-black/80 via-luxury-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 z-10">

          {/* Quick Add */}
          <button
            onClick={handleQuickAdd}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-luxury-gold-500 hover:bg-luxury-gold-400 text-luxury-black font-semibold text-xs tracking-wider uppercase transition-colors shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
          </button>

          {/* Quick View */}
          <button
            onClick={handleQuickViewClick}
            className="p-2 bg-white hover:bg-neutral-100 text-neutral-800 transition-colors"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">

        <div>

          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">

            <span className="uppercase tracking-widest text-[10px] font-medium text-luxury-gold-700">
              {product.category}
            </span>

            <div className="flex items-center gap-1 text-amber-500">

              <Star className="w-3 h-3 fill-current" />

              <span className="font-semibold text-neutral-700 text-[11px]">
                {product.rating}
              </span>

              <span className="text-[10px] text-neutral-400">
                ({product.reviewCount})
              </span>

            </div>
          </div>

          <Link
            to={`/product/${product.id}`}
            className="block"
          >
            <h3 className="font-serif text-sm font-semibold text-neutral-900 line-clamp-1 hover:text-luxury-gold-600 transition-colors">
              {product.name}
            </h3>
          </Link>

        </div>

        <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between">

          <div className="flex items-baseline gap-2">

            <span className="text-sm sm:text-base font-bold text-neutral-900 font-sans">
              {formatPrice(product.price)}
            </span>

            {product.originalPrice > product.price && (
              <span className="text-xs text-neutral-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}

          </div>

          {/* Available Colors Indicator */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center -space-x-1">

              {product.colors.slice(0, 3).map((c, i) => (
                <span
                  key={i}
                  title={c.name}
                  className="w-3 h-3 rounded-full border border-white shadow-xs"
                  style={{ backgroundColor: c.hex }}
                />
              ))}

              {product.colors.length > 3 && (
                <span className="text-[9px] text-neutral-500 font-medium pl-1.5">
                  +{product.colors.length - 3}
                </span>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
