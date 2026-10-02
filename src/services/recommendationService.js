import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/localStorage';

/**
 * Service abstraction for Personalized Product Recommendations.
 */
export const recommendationService = {
  /**
   * Get list of recently viewed product objects
   */
  async getRecentlyViewed() {
    const recentIds = getStorageItem(STORAGE_KEYS.RECENTLY_VIEWED, []);
    const products = getStorageItem(STORAGE_KEYS.PRODUCTS, []);
    return recentIds
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean);
  },

  /**
   * Add a product ID to recently viewed history (max 10)
   */
  addRecentlyViewed(productId) {
    if (!productId) return;
    const recent = getStorageItem(STORAGE_KEYS.RECENTLY_VIEWED, []);
    const filtered = recent.filter((id) => id !== productId);
    const updated = [productId, ...filtered].slice(0, 10);
    setStorageItem(STORAGE_KEYS.RECENTLY_VIEWED, updated);
  },

  /**
   * Get products similar to wishlist items
   */
  async getWishlistRecommendations(wishlistIds = []) {
    const products = getStorageItem(STORAGE_KEYS.PRODUCTS, []);
    if (!wishlistIds.length) {
      return products.filter((p) => p.featured).slice(0, 6);
    }

    const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));
    const categories = [...new Set(wishlistProducts.map((p) => p.categoryId))];

    return products
      .filter((p) => !wishlistIds.includes(p.id) && categories.includes(p.categoryId))
      .slice(0, 6);
  },

  /**
   * Get products similar to a target product
   */
  async getSimilarProducts(product, limit = 4) {
  if (!product) return [];

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/products?category=${encodeURIComponent(
        product.categoryId
      )}`
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success || !Array.isArray(data.data)) {
      return [];
    }

    // Same category products
    const sameCategoryProducts = data.data
      .filter((p) => String(p.id) !== String(product.id));

    // If same category doesn't have enough products,
    // fetch all active products as fallback.
    if (sameCategoryProducts.length < limit) {
      const fallbackResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/products`
      );

      const fallbackData = await fallbackResponse
        .json()
        .catch(() => ({}));

      if (
        fallbackResponse.ok &&
        fallbackData.success &&
        Array.isArray(fallbackData.data)
      ) {
        const fallbackProducts = fallbackData.data.filter(
          (p) =>
            String(p.id) !== String(product.id) &&
            !sameCategoryProducts.some(
              (item) => String(item.id) === String(p.id)
            )
        );

        sameCategoryProducts.push(...fallbackProducts);
      }
    }

    return sameCategoryProducts.slice(0, limit).map((p) => {
      const price = Number(p.price) || 0;

      const originalPrice =
        p.compare_price !== null &&
        p.compare_price !== undefined
          ? Number(p.compare_price)
          : price;

      const discount =
        originalPrice > price
          ? Math.round(
              ((originalPrice - price) / originalPrice) * 100
            )
          : 0;

      return {
        id: String(p.id),
        name: p.name,
        category: p.category_name || 'Uncategorized',
        categoryId: p.category_id
          ? String(p.category_id)
          : null,
        description: p.description || '',
        price,
        originalPrice,
        discount,
        stock: Number(p.stock) || 0,
        images: Array.isArray(p.images) ? p.images : [],
        featured: Boolean(p.is_featured),
        rating: 0,
        reviewCount: 0,
        sizes: Array.isArray(p.sizes) ? p.sizes : [],
        colors: Array.isArray(p.colors) ? p.colors : [],
        newArrival: false,
        trending: false,
        tags: [],
        fabric: '',
        care: '',
        fit: '',
      };
    });
  } catch (error) {
    console.error(
      'Failed to load related products:',
      error
    );

    return [];
  }
},
  /**
   * Get top popular products
   */
  async getPopularProducts(limit = 8) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/products/popular?limit=${limit}`
    );

    const data = await response.json().catch(() => ({}));

    if (
      !response.ok ||
      !data.success ||
      !Array.isArray(data.data)
    ) {
      return [];
    }

    return data.data.map((p) => {
      const price = Number(p.price) || 0;

      const originalPrice =
        p.compare_price !== null &&
        p.compare_price !== undefined
          ? Number(p.compare_price)
          : price;

      const discount =
        originalPrice > price
          ? Math.round(
              ((originalPrice - price) / originalPrice) * 100
            )
          : 0;

      return {
        id: String(p.id),
        name: p.name,
        category: p.category_name || 'Uncategorized',
        categoryId: p.category_id
          ? String(p.category_id)
          : null,
        description: p.description || '',
        price,
        originalPrice,
        discount,
        stock: Number(p.stock) || 0,
        images: Array.isArray(p.images) ? p.images : [],
        featured: Boolean(p.is_featured),

        // Real analytics
        popular: true,
        popularityScore: Number(p.popularity_score) || 0,
        views: Number(p.views) || 0,
        wishlistAdds: Number(p.wishlist_adds) || 0,
        cartAdds: Number(p.cart_adds) || 0,
        whatsappClicks: Number(p.whatsapp_clicks) || 0,
        orders: Number(p.orders) || 0,

        rating: 0,
        reviewCount: 0,
        sizes: Array.isArray(p.sizes) ? p.sizes : [],
        colors: Array.isArray(p.colors) ? p.colors : [],
        newArrival: false,
        trending: false,
        tags: [],
        fabric: '',
        care: '',
        fit: '',
      };
    });
  } catch (error) {
    console.error(
      'Failed to load popular products:',
      error
    );

    return [];
  }
},

  /**
   * Get trending products based on scoring (views, wishlist, cart, try-ons)
   */
  async getTrendingProducts(limit = 12) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/products/trending?limit=${limit}`
    );

    const data = await response.json().catch(() => ({}));

    if (
      !response.ok ||
      !data.success ||
      !Array.isArray(data.data)
    ) {
      return [];
    }

    return data.data.map((p) => {
      const price = Number(p.price) || 0;

      const originalPrice =
        p.compare_price !== null &&
        p.compare_price !== undefined
          ? Number(p.compare_price)
          : price;

      const discount =
        originalPrice > price
          ? Math.round(
              ((originalPrice - price) / originalPrice) * 100
            )
          : 0;

      return {
        id: String(p.id),
        name: p.name,
        category: p.category_name || 'Uncategorized',
        categoryId: p.category_id
          ? String(p.category_id)
          : null,
        description: p.description || '',
        price,
        originalPrice,
        discount,
        stock: Number(p.stock) || 0,
        images: Array.isArray(p.images) ? p.images : [],
        featured: Boolean(p.is_featured),

        // Real analytics
        trending: true,
        trendingScore: Number(p.trending_score) || 0,
        views: Number(p.views) || 0,
        wishlistAdds: Number(p.wishlist_adds) || 0,
        cartAdds: Number(p.cart_adds) || 0,
        whatsappClicks: Number(p.whatsapp_clicks) || 0,
        orders: Number(p.orders) || 0,

        rating: 0,
        reviewCount: 0,
        sizes: Array.isArray(p.sizes) ? p.sizes : [],
        colors: Array.isArray(p.colors) ? p.colors : [],
        newArrival: false,
        tags: [],
        fabric: '',
        care: '',
        fit: '',
      };
    });
  } catch (error) {
    console.error(
      'Failed to load trending products:',
      error
    );

    return [];
  }
}
};
