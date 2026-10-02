import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../common/Toast';
import { Star, Sparkles, Heart, ShoppingBag, ArrowRight } from 'lucide-react';

export const QuickViewModal = ({ product, isOpen, onClose }) => {
  if (!product) return null;

  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  const [selectedImg, setSelectedImg] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '40');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || '');
  const [quantity, setQuantity] = useState(1);

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    addToast(`Added ${quantity} × ${product.name} to Cart`, 'success');
    onClose();
  };

  const handleTryOn = () => {
    onClose();
    navigate(`/try-on?productId=${product.id}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="aspect-[3/4] bg-neutral-100 overflow-hidden border border-neutral-200">
            <img
              src={selectedImg || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-top"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(img)}
                  className={`w-16 h-20 border shrink-0 overflow-hidden transition-all ${
                    selectedImg === img ? 'border-luxury-gold-500 ring-1 ring-luxury-gold-500' : 'border-neutral-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-between h-full space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-luxury-gold-700 font-semibold">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-amber-500 text-xs">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="font-semibold text-neutral-800">{product.rating}</span>
                <span className="text-neutral-400">({product.reviewCount} reviews)</span>
              </div>
            </div>

            <h2 className="font-serif text-xl font-bold text-neutral-900 mt-1">
              {product.name}
            </h2>

            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-2xl font-bold text-neutral-900 font-sans">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-neutral-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.discount > 0 && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                  Save {product.discount}%
                </span>
              )}
            </div>

            <p className="text-xs text-neutral-600 mt-3 leading-relaxed line-clamp-3">
              {product.description}
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-4">
                <span className="text-xs font-semibold text-neutral-800 uppercase tracking-wider block mb-1.5">
                  Color: <span className="font-normal text-neutral-600">{selectedColor}</span>
                </span>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`px-3 py-1 text-xs border flex items-center gap-1.5 transition-all ${
                        selectedColor === color.name
                          ? 'border-luxury-gold-500 bg-luxury-cream-100 font-medium'
                          : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full border border-neutral-300" style={{ backgroundColor: color.hex }} />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-4">
                <span className="text-xs font-semibold text-neutral-800 uppercase tracking-wider block mb-1.5">
                  Select Size
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-10 h-10 text-xs font-semibold flex items-center justify-center border transition-all ${
                        selectedSize === size
                          ? 'border-luxury-black bg-luxury-black text-white'
                          : 'border-neutral-200 text-neutral-700 hover:border-neutral-400 bg-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs font-semibold text-neutral-800 uppercase tracking-wider">
                Qty:
              </span>
              <div className="inline-flex border border-neutral-300">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-2.5 py-1 text-sm hover:bg-neutral-100"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-semibold flex items-center justify-center min-w-[28px]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-2.5 py-1 text-sm hover:bg-neutral-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-4 border-t border-neutral-100">
            <div className="flex gap-2">
              <Button
                variant="gold"
                size="md"
                className="flex-1"
                icon={ShoppingBag}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <button
                onClick={() => {
                  toggleWishlist(product);
                  addToast(isFavorited ? 'Removed from Wishlist' : 'Added to Wishlist', 'success');
                }}
                className={`p-2.5 border transition-colors ${
                  isFavorited
                    ? 'border-rose-300 bg-rose-50 text-rose-600'
                    : 'border-neutral-300 hover:border-neutral-400 text-neutral-600'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>

            <Button
              variant="dark"
              size="sm"
              className="w-full"
              icon={Sparkles}
              onClick={handleTryOn}
            >
              AI Virtual Try-On
            </Button>

            <div className="text-center pt-2">
              <Link
                to={`/product/${product.id}`}
                onClick={onClose}
                className="inline-flex items-center gap-1 text-xs font-semibold text-luxury-gold-700 hover:text-luxury-gold-600 uppercase tracking-wider"
              >
                <span>View Complete Product Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
