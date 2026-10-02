import React, { useState } from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, ExternalLink, ShieldCheck } from 'lucide-react';

export const AdminLayout = () => {
  const { isOwnerAuthenticated, loading } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-luxury-gold-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-gold-500" />
      </div>
    );
  }

  // Frontend route protection for UI preview
  if (!isOwnerAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-neutral-100 font-sans text-neutral-900">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 h-full">
            <AdminSidebar onClose={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Administrative Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Operational Bar */}
        <header className="bg-white border-b border-neutral-200 h-16 flex items-center justify-between px-4 sm:px-6 shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-neutral-900 text-sm sm:text-base">
                L-KUSH Atelier Management
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 font-medium">
                <ShieldCheck className="w-3 h-3" />
                Owner Session Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-luxury-gold-700 transition-colors uppercase tracking-wider"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Public Store</span>
            </Link>
          </div>
        </header>

        {/* Scrollable Page Outlet */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-luxury-ivory/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
