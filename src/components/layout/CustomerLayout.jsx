import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '../cart/CartDrawer';

export const CustomerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-luxury-ivory text-neutral-900 selection:bg-luxury-gold-500 selection:text-white">
      <ScrollRestoration />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};
