import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import { wishlistService } from '../services/wishlistService';
import { trackEvent } from '../utils/analytics';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWishlist = async () => {
    try {
      setLoading(true);

      const data = await wishlistService.getWishlist();

      const productIds = data.map((item) =>
        String(item.product_id)
      );

      setWishlist(productIds);
    } catch (error) {
      console.error('Error loading wishlist:', error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const isInWishlist = (productId) => {
    return wishlist.includes(String(productId));
  };

  const addToWishlist = async (product) => {
    const id =
      typeof product === 'string'
        ? product
        : product.id;

    const productId = String(id);

    if (isInWishlist(productId)) {
      return;
    }

    try {
      await wishlistService.addToWishlist(productId);

      setWishlist((prev) => [
        ...prev,
        productId,
      ]);

      trackEvent('wishlist_add', {
        productId,
        productName:
          typeof product === 'object'
            ? product.name || 'Product'
            : 'Product',
      });
    } catch (error) {
      console.error(
        'Error adding to wishlist:',
        error
      );

      throw error;
    }
  };

  const removeFromWishlist = async (productId) => {
    const id = String(productId);

    try {
      await wishlistService.removeFromWishlist(id);

      setWishlist((prev) =>
        prev.filter(
          (wishlistId) => wishlistId !== id
        )
      );

      trackEvent('wishlist_remove', {
        productId: id,
      });
    } catch (error) {
      console.error(
        'Error removing from wishlist:',
        error
      );

      throw error;
    }
  };

  const toggleWishlist = async (product) => {
    const id =
      typeof product === 'string'
        ? product
        : product.id;

    if (isInWishlist(id)) {
      await removeFromWishlist(id);
    } else {
      await addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        isInWishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        wishlistCount: wishlist.length,
        refreshWishlist: loadWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      'useWishlist must be used within a WishlistProvider'
    );
  }

  return context;
};