
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getStorageItem,
  setStorageItem,
  STORAGE_KEYS
} from '../utils/localStorage';
import { trackEvent } from '../utils/analytics';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() =>
    getStorageItem(STORAGE_KEYS.CART, [])
  );

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.CART, cart);
  }, [cart]);

  const addToCart = (
    product,
    size = '40',
    color = null,
    quantity = 1
  ) => {
    const selectedColor =
      color ||
      (product.colors && product.colors[0]?.name) ||
      'Standard';

    const selectedSize =
      size ||
      (product.sizes && product.sizes[0]) ||
      '40';

    const cartItemId = `${product.id}-${selectedSize}-${selectedColor.replace(
      /\s+/g,
      ''
    )}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === cartItemId
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];

        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };

        return updated;
      }

      return [
        ...prevCart,
        {
          id: cartItemId,
          productId: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images?.[0] || '',
          size: selectedSize,
          color: selectedColor,
          quantity
        }
      ];
    });

    trackEvent('cart_add', {
      productId: product.id,
      name: product.name,
      size: selectedSize,
      color: selectedColor,
      price: product.price,
      quantity
    });

    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (cartItemId) => {
    const itemToRemove = cart.find(
      (item) => item.id === cartItemId
    );

    setCart((prevCart) =>
      prevCart.filter((item) => item.id !== cartItemId)
    );

    if (itemToRemove) {
      trackEvent('cart_remove', {
        productId: itemToRemove.productId,
        name: itemToRemove.name
      });
    }
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === cartItemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const itemCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        isCartDrawerOpen,
        setIsCartDrawerOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }

  return context;
};
