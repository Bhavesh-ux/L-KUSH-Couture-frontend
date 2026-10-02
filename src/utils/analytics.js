import {
  getStorageItem,
  setStorageItem,
  STORAGE_KEYS
} from './localStorage';

const getToken = () => {
  return getStorageItem('lkush_auth_token', null);
};

export const trackEvent = async (
  eventName,
  payload = {}
) => {
  try {
    const productId =
      payload?.productId !== undefined &&
      payload?.productId !== null &&
      payload?.productId !== ''
        ? Number(payload.productId)
        : null;

    const metadata = {
      ...payload
    };

    delete metadata.productId;

    const token = getToken();

    const headers = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/analytics`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          eventName,
          productId,
          metadata
        })
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || 'Failed to track analytics event'
      );
    }

    if (import.meta.env.DEV) {
      console.log(
        `[L-KUSH Analytics] ${eventName}:`,
        data.data
      );
    }

    return data.data;
  } catch (error) {
    console.error(
      'Failed to track analytics event:',
      error
    );

    return null;
  }
};