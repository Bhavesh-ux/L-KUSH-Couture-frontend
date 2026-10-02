import { getStorageItem } from '../utils/localStorage';

const getToken = () => {
  return getStorageItem('lkush_auth_token', null);
};

const getHeaders = (includeJson = false) => {
  const token = getToken();

  if (!token) {
    throw new Error(
      'Authentication required. Please login again.'
    );
  }

  return {
    ...(includeJson
      ? { 'Content-Type': 'application/json' }
      : {}),
    Authorization: `Bearer ${token}`,
  };
};

const parseResponse = async (response, fallbackMessage) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || fallbackMessage
    );
  }

  if (!data.success) {
    throw new Error(
      data.message || fallbackMessage
    );
  }

  return data;
};

export const wishlistService = {

  // GET MY WISHLIST
  async getWishlist() {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/wishlist`,
      {
        method: 'GET',
        headers: getHeaders(),
      }
    );

    const data = await parseResponse(
      response,
      'Failed to fetch wishlist'
    );

    return Array.isArray(data.data)
      ? data.data
      : [];
  },

  // ADD TO WISHLIST
  async addToWishlist(productId) {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/wishlist`,
      {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify({
          productId,
        }),
      }
    );

    const data = await parseResponse(
      response,
      'Failed to add product to wishlist'
    );

    return data.data;
  },

  // REMOVE FROM WISHLIST
  async removeFromWishlist(productId) {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/wishlist/${productId}`,
      {
        method: 'DELETE',
        headers: getHeaders(),
      }
    );

    const data = await parseResponse(
      response,
      'Failed to remove product from wishlist'
    );

    return data.data;
  },
};