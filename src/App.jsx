import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastProvider } from './components/common/Toast';

import { CustomerLayout } from './components/layout/CustomerLayout';
import { AdminLayout } from './components/layout/AdminLayout';

import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Category } from './pages/Category';
import { ProductDetails } from './pages/ProductDetails';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Profile } from './pages/Profile';
import { Wishlist } from './pages/Wishlist';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Orders } from './pages/Orders';
import { Notifications } from './pages/Notifications';
import { Recommendations } from './pages/Recommendations';
import { Trending } from './pages/Trending';

import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminAddProduct } from './pages/admin/AdminAddProduct';
import { AdminEditProduct } from './pages/admin/AdminEditProduct';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminNotifications } from './pages/admin/AdminNotifications';

const NotFound = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
    <span className="font-serif text-6xl font-bold text-luxury-gold-500 mb-4">404</span>
    <h1 className="font-serif text-2xl font-bold text-neutral-900 mb-2">Page Not Found</h1>
    <p className="text-neutral-500 text-sm mb-6">
      The page you are looking for does not exist or has been moved.
    </p>
    <a
      href="/"
      className="px-5 py-2.5 bg-luxury-black text-luxury-cream-100 text-xs font-semibold uppercase tracking-wider hover:bg-luxury-charcoal transition-colors"
    >
      Return to Home
    </a>
  </div>
);

const router = createBrowserRouter([
  {
    element: <CustomerLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/shop', element: <Shop /> },
      { path: '/category/:categoryId', element: <Category /> },
      { path: '/product/:productId', element: <ProductDetails /> },
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },
      { path: '/profile', element: <Profile /> },
      { path: '/wishlist', element: <Wishlist /> },
      { path: '/cart', element: <Cart /> },
      { path: '/checkout', element: <Checkout /> },
      { path: '/orders', element: <Orders /> },
      { path: '/notifications', element: <Notifications /> },
      { path: '/recommendations', element: <Recommendations /> },
      { path: '/trending', element: <Trending /> },
      { path: '*', element: <NotFound /> }
    ]
  },
  {
    path: '/admin/login',
    element: <AdminLogin />
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'products', element: <AdminProducts /> },
      { path: 'products/add', element: <AdminAddProduct /> },
      { path: 'products/edit/:productId', element: <AdminEditProduct /> },
      { path: 'categories', element: <AdminCategories /> },
      { path: 'orders', element: <AdminOrders /> },
      { path: 'users', element: <AdminUsers /> },
      { path: 'analytics', element: <AdminAnalytics /> },
      { path: 'notifications', element: <AdminNotifications /> }
    ]
  }
]);

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <WishlistProvider>
            <NotificationProvider>
              <RouterProvider router={router} />
            </NotificationProvider>
          </WishlistProvider>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
