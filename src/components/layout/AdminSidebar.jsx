import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoImg from '../../assets/logo.jpg';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderTree,
  ShoppingBag,
  Users,
  BarChart3,
  Bell,
  LogOut,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminSidebar = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutOwner, owner } = useAuth();

  const handleLogout = () => {
    logoutOwner();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Overview Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Products Inventory', path: '/admin/products', icon: Package },
    { label: 'Add New Product', path: '/admin/products/add', icon: PlusCircle },
    { label: 'Categories Manager', path: '/admin/categories', icon: FolderTree },
    { label: 'Orders & WhatsApp', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Client Directory', path: '/admin/users', icon: Users },
    { label: 'Deep Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Broadcast Notifications', path: '/admin/notifications', icon: Bell }
  ];

  return (
    <div className="w-64 bg-luxury-black text-neutral-300 flex flex-col h-full border-r border-neutral-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-neutral-800 flex flex-col items-center text-center">
        <Link to="/admin" onClick={onClose}>
          <img src={logoImg} alt="L-KUSH Couture" className="h-12 w-auto object-contain" />
        </Link>
        <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-widest bg-luxury-gold-500/10 text-luxury-gold-400 border border-luxury-gold-500/30">
          <span>Owner Admin Portal</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 overflow-y-auto px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-none transition-all ${
                isActive
                  ? 'bg-luxury-gold-500 text-luxury-black shadow-gold-subtle'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Owner Info & Actions */}
      <div className="p-4 border-t border-neutral-800 bg-neutral-950 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-luxury-gold-500 text-luxury-black font-bold flex items-center justify-center text-xs">
            LK
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">
              {owner?.name || 'L-KUSH Owner'}
            </p>
            <p className="text-[10px] text-neutral-400 truncate">Single Business Owner</p>
          </div>
        </div>

        <div className="pt-2 border-t border-neutral-900 flex flex-col gap-1.5">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between text-xs text-neutral-400 hover:text-luxury-gold-300 py-1"
          >
            <span className="flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" />
              Storefront View
            </span>
            <span className="text-[10px] uppercase font-bold text-luxury-gold-500">Live</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-rose-400 hover:text-rose-300 py-1 transition-colors uppercase tracking-wider font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Portal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
