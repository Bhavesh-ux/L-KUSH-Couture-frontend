import { getStorageItem } from '../utils/localStorage';

const getToken = () => {
  return getStorageItem('lkush_auth_token', null);
};

const getHeaders = () => {
  const token = getToken();

  if (!token) {
    throw new Error(
      'Authentication required. Please login again.'
    );
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

const parseResponse = async (
  response,
  fallbackMessage
) => {
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

const normalizeNotification = (notification) => {
  if (!notification) return null;

  return {
    ...notification,

    id: String(notification.id),

    orderId: notification.order_id
      ? String(notification.order_id)
      : null,

    read: Boolean(notification.is_read),

    timestamp:
      notification.created_at || null,
  };
};

export const notificationService = {

  // -----------------------------------------
  // CUSTOMER: GET MY NOTIFICATIONS
  // -----------------------------------------
  async getNotifications() {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/notifications`,
      {
        method: 'GET',
        headers: getHeaders(),
      }
    );

    const data = await parseResponse(
      response,
      'Failed to fetch notifications'
    );

    return Array.isArray(data.data)
      ? data.data.map(normalizeNotification)
      : [];
  },

  // -----------------------------------------
  // CUSTOMER: MARK ONE AS READ
  // -----------------------------------------
  async markAsRead(id) {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/notifications/${id}/read`,
      {
        method: 'PUT',
        headers: getHeaders(),
      }
    );

    const data = await parseResponse(
      response,
      'Failed to mark notification as read'
    );

    return normalizeNotification(data.data);
  },

  // -----------------------------------------
  // CUSTOMER: MARK ALL AS READ
  // -----------------------------------------
  async markAllAsRead() {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/notifications/read-all`,
      {
        method: 'PUT',
        headers: getHeaders(),
      }
    );

    const data = await parseResponse(
      response,
      'Failed to mark all notifications as read'
    );

    return data.data;
  },
};