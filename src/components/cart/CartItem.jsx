import React from 'react';
import { Trash2, Heart, Plus, Minus } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../common/Toast';
import { Link } from 'react-router-dom';

export const CartItem = ({ item, isCompact = false }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();

  const handleMoveToWishlist = () => {
    if (!isInWishlist(item.productId)) {
      toggleWishlist({ id: item.productId, name: item.name });
      addToast(`Moved ${item.name} to Wishlist`, 'success');
    }
    removeFromCart(item.id);
  };

  return (
    <div className={`flex gap-3 py-3.5 border-b border-neutral-100 ${isCompact ? 'text-xs' : 'text-sm'}`}>
      {/* Thumbnail */}
      <Link to={`/product/${item.productId}`} className="w-16 sm:w-20 aspect-[3/4] bg-neutral-100 shrink-0 overflow-hidden border border-neutral-200">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <Link
              to={`/product/${item.productId}`}
              className="font-serif font-semibold text-neutral-900 hover:text-luxury-gold-700 transition-colors line-clamp-1"
            >
              {item.name}
            </Link>
            <span className="font-bold text-neutral-900 whitespace-nowrap">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>

          <div className="text-[11px] text-neutral-500 mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
            <span>Size: <strong className="text-neutral-700">{item.size}</strong></span>
            <span>Color: <strong className="text-neutral-700">{item.color}</strong></span>
          </div>
        </div>

        {/* Quantity and Actions */}
        <div className="flex items-center justify-between mt-2 pt-1">
          <div className="inline-flex items-center border border-neutral-300 bg-white">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="p-1 hover:bg-neutral-100 text-neutral-600"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-2 text-xs font-semibold">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="p-1 hover:bg-neutral-100 text-neutral-600"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-neutral-400">
            <button
              onClick={handleMoveToWishlist}
              className="hover:text-rose-600 transition-colors p-1"
              title="Move to Wishlist"
            >
              <Heart className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                removeFromCart(item.id);
                addToast(`Removed ${item.name} from Cart`, 'info');
              }}
              className="hover:text-neutral-900 transition-colors p-1"
              title="Remove"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
