import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  STORAGE_KEYS,
} from '../utils/localStorage';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AUTH_TOKEN_KEY = 'lkush_auth_token';

const apiRequest = async (endpoint, options = {}) => {
  const token = getStorageItem(AUTH_TOKEN_KEY, null);

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || 'Something went wrong. Please try again.'
    );
  }

  return data;
};

export const authService = {
  // --- Customer Authentication ---

  async loginCustomer(email, password, rememberMe = false) {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: email.trim(),
        password,
      }),
    });

    if (!data.token || !data.data) {
      throw new Error('Invalid login response from server.');
    }

    const customer = data.data;

    setStorageItem(AUTH_TOKEN_KEY, data.token);
    setStorageItem(STORAGE_KEYS.CUSTOMER_AUTH, customer);

    return {
      success: true,
      customer,
      token: data.token,
      rememberMe,
    };
  },

  async signupCustomer({ name, email, phone, password }) {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || undefined,
        password,
      }),
    });

    if (!data.data) {
      throw new Error('Invalid registration response from server.');
    }

    const customer = data.data;

    setStorageItem(STORAGE_KEYS.CUSTOMER_AUTH, customer);

    return {
      success: true,
      customer,
    };
  },

  getCurrentCustomer() {
    return getStorageItem(STORAGE_KEYS.CUSTOMER_AUTH, null);
  },

  async restoreCustomerSession() {
    const token = getStorageItem(AUTH_TOKEN_KEY, null);

    if (!token) {
      return null;
    }

    try {
      const data = await apiRequest('/auth/me', {
        method: 'GET',
      });

      if (!data.data) {
        throw new Error('Invalid session response.');
      }

      setStorageItem(STORAGE_KEYS.CUSTOMER_AUTH, data.data);

      return data.data;
    } catch (error) {
      removeStorageItem(AUTH_TOKEN_KEY);
      removeStorageItem(STORAGE_KEYS.CUSTOMER_AUTH);

      return null;
    }
  },

  logoutCustomer() {
    removeStorageItem(AUTH_TOKEN_KEY);
    removeStorageItem(STORAGE_KEYS.CUSTOMER_AUTH);
  },

  // Profile update will be connected after backend profile API is verified.
  async updateCustomerProfile(updatedData) {
  const data = await apiRequest('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify({
      name: updatedData.name,
      phone: updatedData.phone,
      address: updatedData.address,
      city: updatedData.city,
      state: updatedData.state,
      pincode: updatedData.pincode,
    }),
  });

  if (!data.data) {
    throw new Error('Invalid profile update response from server.');
  }

  // Keep frontend session in sync with backend data
  setStorageItem(
    STORAGE_KEYS.CUSTOMER_AUTH,
    data.data
  );

  return data.data;
},

  // --- Owner / Admin Authentication ---

  async loginOwner(email, password) {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: email.trim(),
        password,
      }),
    });

    if (!data.token || !data.data) {
      throw new Error(
        'Invalid admin login response from server.'
      );
    }

    // Backend user must have admin role.
    if (data.data.role !== 'admin') {
      throw new Error(
        'You are not authorized to access the owner portal.'
      );
    }

    const owner = {
      ...data.data,
      role: 'owner',
    };

    // Store the real backend JWT.
    setStorageItem(
      AUTH_TOKEN_KEY,
      data.token
    );

    // Store owner session for frontend UI.
    setStorageItem(
      STORAGE_KEYS.OWNER_AUTH,
      owner
    );

    return {
      success: true,
      owner,
      token: data.token,
    };
  },

  getCurrentOwner() {
    return getStorageItem(
      STORAGE_KEYS.OWNER_AUTH,
      null
    );
  },

  logoutOwner() {
    removeStorageItem(AUTH_TOKEN_KEY);
    removeStorageItem(STORAGE_KEYS.OWNER_AUTH);
  },
};