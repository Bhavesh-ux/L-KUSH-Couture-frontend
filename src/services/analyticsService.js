import { getStorageItem, STORAGE_KEYS } from '../utils/localStorage';
import { trackEvent as trackUtilEvent } from '../utils/analytics';

/**
 * Service abstraction for Owner / Admin Analytics & Event Tracking.
 */
export const analyticsService = {
  trackEvent(name, payload) {
    trackUtilEvent(name, payload);
  },

 async getSummary(days = null) {
  const token = getStorageItem('lkush_auth_token', null);

  if (!token) {
    throw new Error('Authentication required. Please login again.');
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/analytics/dashboard-summary${
      days ? `?days=${days}` : ''
    }`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || 'Failed to fetch analytics summary'
    );
  }

  const summary = data.data || {};

  return {
    totalProducts: Number(summary.total_products || 0),
    totalCustomers: Number(summary.total_customers || 0),
    totalOrders: Number(summary.total_orders || 0),

    whatsappOrderRequests: Number(
      summary.whatsapp_order_requests || 0
    ),

    productViews: Number(summary.product_views || 0),

    wishlistActivity: Number(
      summary.wishlist_activity || 0
    ),

    cartActivity: Number(
      summary.cart_activity || 0
    ),

    // AI Try-On is postponed, so do not show fake analytics.
    aiTryOns: 0,

    // Visitor tracking is not implemented yet.
    visitors: 0,

    paidRevenue: Number(summary.paid_revenue || 0),

    deliveredOrders: Number(
      summary.delivered_orders || 0
    ),
  };
},

  async getDailyTraffic() {
  const token = getStorageItem('lkush_auth_token', null);

  if (!token) {
    throw new Error('Authentication required. Please login again.');
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/analytics/daily-analytics`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || 'Failed to fetch daily analytics'
    );
  }

  return Array.isArray(data.data)
  ? data.data.map((item) => ({
      date: item.date,
      productViews: Number(item.product_views || 0),
      wishlistAdds: Number(item.wishlist_adds || 0),
      cartAdds: Number(item.cart_adds || 0),
      whatsappClicks: Number(item.whatsapp_clicks || 0),
    }))
  : [];
},

 async getCategoryPerformance() {
  const token = getStorageItem('lkush_auth_token', null);

  if (!token) {
    throw new Error('Authentication required. Please login again.');
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/analytics/category-performance`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || 'Failed to fetch category performance'
    );
  }

  return Array.isArray(data.data)
    ? data.data.map((category) => ({
        id: String(category.id),
        name: category.name,
        value: Number(category.value || 0),
        views: Number(category.views || 0),
      }))
    : [];
},

  async getTopTriedAttires() {
    await new Promise((res) => setTimeout(res, 120));
    const analytics = getStorageItem(STORAGE_KEYS.ANALYTICS, {});
    return analytics.topTriedAttires || [];
  },

    async getDailyRevenue() {
    const token = getStorageItem('lkush_auth_token', null);

    if (!token) {
      throw new Error('Authentication required. Please login again.');
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/analytics/daily-revenue`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || 'Failed to fetch daily revenue'
      );
    }

    return Array.isArray(data.data)
  ? data.data.map((item) => ({
      date: item.date,
      revenue: Number(item.revenue || 0),
    }))
  : [];
  },

  async getProductAnalytics(days = null)  {
  const token = getStorageItem('lkush_auth_token', null);
  console.log('Analytics token:', token ? 'TOKEN_PRESENT' : 'TOKEN_MISSING');

  if (!token) {
    throw new Error('Authentication required. Please login again.');
  }

  const response = await fetch(
  `${import.meta.env.VITE_API_URL}/analytics/product-analytics${
    days ? `?days=${days}` : ''
  }`,
  {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || 'Failed to fetch product analytics'
    );
  }

  return Array.isArray(data.data)
    ? data.data.map((product) => {
        const views = Number(product.views || 0);
        const wishlistAdds = Number(product.wishlist_adds || 0);
        const cartAdds = Number(product.cart_adds || 0);
        const whatsappClicks = Number(
          product.whatsapp_clicks || 0
        );

        return {
          id: String(product.id),
          name: product.name,
          price: Number(product.price || 0),
          views,
          wishlistAdds,
          cartAdds,
          aiTryOns: 0,
          checkoutStarts: 0,
          whatsappClicks,
          orders: Number(product.orders || 0),
          conversionRate:
            views > 0
              ? `${((whatsappClicks / views) * 100).toFixed(2)}%`
              : '0%',
        };
      })
    : [];
},
};
