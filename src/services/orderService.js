import { getStorageItem } from '../utils/localStorage';

/**
 * Service abstraction for Customer & Owner Order processing.
 *
 * Backend connected:
 * - Create order
 * - Get customer orders
 * - Get customer order by ID
 * - Get all orders (admin)
 * - Get admin order by ID
 * - Update order status (admin)
 * - Update payment status (admin)
 * - Cancel customer order
 */

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

const normalizeOrder = (order) => {
  if (!order) return null;

  return {
    ...order,

    // Backend uses numeric DB id
    id: String(order.id),

    // Frontend previously used totalAmount
    totalAmount: Number(order.total_amount || 0),

    // Keep backend field as well
    total_amount: Number(order.total_amount || 0),

    paymentStatus:
    order.payment_status || 'pending',

    payment_status:
    order.payment_status || 'pending',

    // Backend uses created_at
    date: order.created_at || null,

    // Customer-friendly field names
    customerName:
      order.shipping_name ||
      order.customer_name ||
      '',

    customerPhone:
      order.shipping_phone || '',

    customerEmail:
      order.customer_email || '',

    shippingAddress: {
      address:
        order.shipping_address || '',
      city:
        order.city || '',
      state:
        order.state || '',
      pincode:
        order.pincode || '',
    },

    // Normalize items
    items: Array.isArray(order.items)
      ? order.items.map((item) => ({
          ...item,

          id: String(
            item.product_id ?? item.id
          ),

          productId:
            item.product_id ?? item.productId,

          name:
  item.product_name ||
  item.productName ||
  item.name ||
  '',

          price: Number(
            item.price || 0
          ),

          quantity: Number(
            item.quantity || 0
          ),

          subtotal: Number(
            item.subtotal || 0
          ),
        }))
      : [],
  };
};

export const orderService = {

  // -----------------------------------------
  // ADMIN: GET ALL ORDERS
  // -----------------------------------------
  async getOrders() {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/orders/admin/all`,
      {
        method: 'GET',
        headers: getHeaders(),
      }
    );

    const data = await parseResponse(
      response,
      'Failed to fetch orders'
    );

    return Array.isArray(data.data)
      ? data.data.map(normalizeOrder)
      : [];
  },

  // -----------------------------------------
  // CUSTOMER: GET MY ORDERS
  // -----------------------------------------
  async getCustomerOrders() {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/orders/my-orders`,
      {
        method: 'GET',
        headers: getHeaders(),
      }
    );

    const data = await parseResponse(
      response,
      'Failed to fetch your orders'
    );

    return Array.isArray(data.data)
      ? data.data.map(normalizeOrder)
      : [];
  },

  // -----------------------------------------
  // CUSTOMER: GET MY ORDER BY ID
  // -----------------------------------------
  async getOrderById(id) {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/orders/my-orders/${id}`,
      {
        method: 'GET',
        headers: getHeaders(),
      }
    );

    const data = await parseResponse(
      response,
      'Failed to fetch order'
    );

    return normalizeOrder(data.data);
  },

  // -----------------------------------------
  // CREATE ORDER
  // -----------------------------------------
  async createOrder(orderData) {
    if (!orderData) {
      throw new Error(
        'Order information is required.'
      );
    }

    const shipping =
      orderData.shippingAddress || {};

    const payload = {
      items: Array.isArray(orderData.items)
  ? orderData.items.map((item) => ({
      productId:
        item.productId ||
        item.id,

      name:
        item.name || '',

      quantity:
        Number(item.quantity) || 0,

      size:
        item.size || null,

      color:
        item.color || null,
    }))
  : [],

      shippingName:
        orderData.customerName?.trim() ||
        '',

      shippingPhone:
        orderData.customerPhone?.trim() ||
        '',

      shippingAddress:
        shipping.address?.trim() ||
        '',

      city:
        shipping.city?.trim() ||
        '',

      state:
        shipping.state?.trim() ||
        '',

      pincode:
        shipping.pincode?.trim() ||
        '',
    };

    if (!payload.items.length) {
      throw new Error(
        'Your cart is empty.'
      );
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/orders`,
      {
        method: 'POST',

        headers: getHeaders(true),

        body: JSON.stringify(payload),
      }
    );

    const data = await parseResponse(
      response,
      'Failed to create order'
    );

    return normalizeOrder(data.data);
  },

  // -----------------------------------------
  // ADMIN: UPDATE ORDER STATUS
  // -----------------------------------------
  async updateOrderStatus(orderId, status) {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/orders/admin/${orderId}/status`,
      {
        method: 'PUT',

        headers: getHeaders(true),

        body: JSON.stringify({
          status,
        }),
      }
    );

    const data = await parseResponse(
      response,
      'Failed to update order status'
    );

    return normalizeOrder(data.data);
  },

  // -----------------------------------------
  // ADMIN: UPDATE PAYMENT STATUS
  // -----------------------------------------
  async updatePaymentStatus(
    orderId,
    paymentStatus
  ) {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/orders/admin/${orderId}/payment-status`,
      {
        method: 'PUT',

        headers: getHeaders(true),

        body: JSON.stringify({
          paymentStatus,
        }),
      }
    );

    const data = await parseResponse(
      response,
      'Failed to update payment status'
    );

    return normalizeOrder(data.data);
  },

  // -----------------------------------------
  // CUSTOMER: CANCEL MY ORDER
  // -----------------------------------------
  async cancelOrder(orderId) {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/orders/my-orders/${orderId}/cancel`,
      {
        method: 'PUT',

        headers: getHeaders(),
      }
    );

    const data = await parseResponse(
      response,
      'Failed to cancel order'
    );

    return normalizeOrder(data.data);
  },

  // -----------------------------------------
  // ADMIN: GET SINGLE ORDER
  // -----------------------------------------
  async getAdminOrderById(orderId) {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/orders/admin/${orderId}`,
      {
        method: 'GET',

        headers: getHeaders(),
      }
    );

    const data = await parseResponse(
      response,
      'Failed to fetch order'
    );

    return normalizeOrder(data.data);
  },
};