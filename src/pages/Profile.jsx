import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Button } from '../components/common/Button';
import { useToast } from '../components/common/Toast';
import {
  User,
  ShoppingBag,
  Heart,
  Sparkles,
  Bell,
  MapPin,
  Phone,
  Mail,
  Edit2,
  Check,
  LogOut,
  Calendar
} from 'lucide-react';

export const Profile = () => {
  const { customer, isAuthenticated, updateProfile, logoutCustomer } = useAuth();
  const { wishlistCount } = useWishlist();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    phone: customer?.phone || '',
    address: customer?.address || '',
    city: customer?.city || '',
    state: customer?.state || '',
    pincode: customer?.pincode || ''
  });
  const [saving, setSaving] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-2">Client Portal</h2>
        <p className="text-xs text-neutral-500 mb-6">
          Please sign in to view your bespoke profile, order history, and saved looks.
        </p>
        <Link to="/login">
          <Button variant="gold" size="md">Sign In to Continue</Button>
        </Link>
      </div>
    );
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(formData);
      addToast("Profile details updated successfully.", "success");
      setIsEditing(false);
    } catch (err) {
      addToast(err.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    logoutCustomer();
    addToast("Signed out successfully", "info");
    navigate('/');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Profile Header Banner */}
      <div className="bg-white border border-neutral-200/90 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-neutral-200 border-2 border-luxury-gold-500 shrink-0">
            <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-white font-serif text-3xl font-bold">
  {customer?.name?.charAt(0)?.toUpperCase() || 'C'}
</div>
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-widest bg-luxury-gold-100 text-luxury-gold-900 border border-luxury-gold-300">
              Patron Member
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
              {customer.name}
            </h1>
            <p className="text-xs text-neutral-500 flex items-center justify-center sm:justify-start gap-1">
              <Mail className="w-3.5 h-3.5" />
              <span>{customer.email}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-neutral-300 hover:bg-neutral-50 text-neutral-700 inline-flex items-center gap-1.5 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>
          <button
            onClick={handleSignOut}
            className="p-2 text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to="/orders"
          className="bg-white p-5 border border-neutral-200/80 shadow-xs hover:border-luxury-gold-500/50 hover:shadow-md transition-all text-center space-y-2 group"
        >
          <div className="w-10 h-10 rounded-full bg-luxury-cream-100 flex items-center justify-center text-luxury-gold-700 mx-auto group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span className="font-serif font-bold text-xl text-neutral-900 block">
            {customer.ordersCount || 0}
          </span>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 block">
            My Orders
          </span>
        </Link>

        <Link
          to="/wishlist"
          className="bg-white p-5 border border-neutral-200/80 shadow-xs hover:border-luxury-gold-500/50 hover:shadow-md transition-all text-center space-y-2 group"
        >
          <div className="w-10 h-10 rounded-full bg-luxury-cream-100 flex items-center justify-center text-luxury-gold-700 mx-auto group-hover:scale-110 transition-transform">
            <Heart className="w-5 h-5" />
          </div>
          <span className="font-serif font-bold text-xl text-neutral-900 block">
            {wishlistCount}
          </span>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 block">
            Saved Wishlist
          </span>
        </Link>

        <Link
          to="/saved-looks"
          className="bg-white p-5 border border-neutral-200/80 shadow-xs hover:border-luxury-gold-500/50 hover:shadow-md transition-all text-center space-y-2 group"
        >
          <div className="w-10 h-10 rounded-full bg-luxury-cream-100 flex items-center justify-center text-luxury-gold-700 mx-auto group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-serif font-bold text-xl text-neutral-900 block">
            Studio
          </span>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 block">
            Saved AI Looks
          </span>
        </Link>

        <Link
          to="/notifications"
          className="bg-white p-5 border border-neutral-200/80 shadow-xs hover:border-luxury-gold-500/50 hover:shadow-md transition-all text-center space-y-2 group"
        >
          <div className="w-10 h-10 rounded-full bg-luxury-cream-100 flex items-center justify-center text-luxury-gold-700 mx-auto group-hover:scale-110 transition-transform">
            <Bell className="w-5 h-5" />
          </div>
          <span className="font-serif font-bold text-xl text-neutral-900 block">
            Alerts
          </span>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 block">
            Notifications
          </span>
        </Link>
      </div>

      {/* Personal Information & Delivery Address */}
      <div className="bg-white border border-neutral-200/90 p-6 sm:p-8 shadow-sm">
        <h2 className="font-serif text-lg font-bold text-neutral-900 mb-4 pb-3 border-b border-neutral-100">
          Personal Information & Atelier Delivery Coordinates
        </h2>

        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-luxury-gold-500"
                />
              </div>
              <div>
                <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                  Phone (WhatsApp Contact)
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-luxury-gold-500"
                />
              </div>
            </div>

            <div>
              <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                Street Address / Residence
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-luxury-gold-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-luxury-gold-500"
                />
              </div>
              <div>
                <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-luxury-gold-500"
                />
              </div>
              <div>
                <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  required
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-luxury-gold-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" variant="gold" size="md" loading={saving} icon={Check}>
                Save Changes
              </Button>
              <Button type="button" variant="ghost" size="md" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-neutral-700">
            <div className="space-y-3">
              <div>
                <span className="text-[11px] text-neutral-400 uppercase font-semibold block">Full Name</span>
                <span className="font-semibold text-neutral-900 text-sm">{customer.name}</span>
              </div>
              <div>
                <span className="text-[11px] text-neutral-400 uppercase font-semibold block">Email Address</span>
                <span className="font-medium text-neutral-900">{customer.email}</span>
              </div>
              <div>
                <span className="text-[11px] text-neutral-400 uppercase font-semibold block">WhatsApp Contact</span>
                <span className="font-medium text-neutral-900">{customer.phone || 'Not provided'}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] text-neutral-400 uppercase font-semibold block">Residence Address</span>
                <span className="font-medium text-neutral-900 leading-relaxed block">
                  {customer.address || 'No street address saved'}
                </span>
                <span className="text-neutral-600 block">
                  {customer.city ? `${customer.city}, ${customer.state} - ${customer.pincode}` : ''}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-neutral-400 uppercase font-semibold block">Patron Since</span>
                <span className="font-medium text-neutral-900">{customer.joinedDate || '2025'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
