import { initialProducts } from '../data/initialProducts';
import { initialCategories } from '../data/initialCategories';
import { initialCustomers } from '../data/initialUsers';
import { initialOrders } from '../data/initialOrders';
import { initialNotifications } from '../data/initialNotifications';
import { initialAnalytics } from '../data/initialAnalytics';

const STORAGE_KEYS = {
  PRODUCTS: 'lkush_products',
  CATEGORIES: 'lkush_categories',
  CUSTOMERS: 'lkush_customers',
  ORDERS: 'lkush_orders',
  NOTIFICATIONS: 'lkush_notifications',
  ANALYTICS: 'lkush_analytics',
  CART: 'lkush_cart',
  WISHLIST: 'lkush_wishlist',
  SAVED_LOOKS: 'lkush_saved_looks',
  RECENTLY_VIEWED: 'lkush_recently_viewed',
  EVENTS: 'lkush_events',
  CUSTOMER_AUTH: 'lkush_customer_auth',
  OWNER_AUTH: 'lkush_owner_auth'
};

export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
  }
};

export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
};

/**
 * Initializes localStorage with default mock data if not already present.
 */
export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    setStorageItem(STORAGE_KEYS.PRODUCTS, initialProducts);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    setStorageItem(STORAGE_KEYS.CATEGORIES, initialCategories);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
    setStorageItem(STORAGE_KEYS.CUSTOMERS, initialCustomers);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    setStorageItem(STORAGE_KEYS.ORDERS, initialOrders);
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    setStorageItem(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ANALYTICS)) {
    setStorageItem(STORAGE_KEYS.ANALYTICS, initialAnalytics);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CART)) {
    setStorageItem(STORAGE_KEYS.CART, []);
  }
  if (!localStorage.getItem(STORAGE_KEYS.WISHLIST)) {
    setStorageItem(STORAGE_KEYS.WISHLIST, ["lk-001", "lk-004"]);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SAVED_LOOKS)) {
    setStorageItem(STORAGE_KEYS.SAVED_LOOKS, [
      {
        id: "look-001",
        date: "2026-03-18T14:30:00Z",
        productId: "lk-001",
        productName: "Royal Velvet Zardozi Sherwani",
        productImage: "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=600&q=80",
        customerPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
        resultImage: "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=800&q=80",
        notes: "Royal Wedding Look - Midnight Navy"
      }
    ]);
  }
  if (!localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED)) {
    setStorageItem(STORAGE_KEYS.RECENTLY_VIEWED, ["lk-001", "lk-002", "lk-003"]);
  }
  if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
    setStorageItem(STORAGE_KEYS.EVENTS, []);
  }
};

export { STORAGE_KEYS };
