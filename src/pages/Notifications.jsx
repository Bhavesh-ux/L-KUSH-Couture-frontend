
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { formatRelativeTime } from '../utils/formatters';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import {
  Bell,
  Sparkles,
  ShoppingBag,
  Heart,
  Tag,
  Clock,
  CheckCheck,
  ArrowRight,
  Info
} from 'lucide-react';

export const Notifications = () => {
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    loading
  } = useNotifications();

  const [filter, setFilter] = useState('all');

  const getNotifIcon = (type) => {
    switch (type) {
      case 'order':
        return (
          <ShoppingBag className="w-4 h-4 text-emerald-600" />
        );

      case 'wishlist':
        return (
          <Heart className="w-4 h-4 text-rose-600" />
        );

      case 'offer':
      case 'new_collection':
      case 'new_product':
        return (
          <Tag className="w-4 h-4 text-amber-600" />
        );

      case 'general':
      default:
        return (
          <Info className="w-4 h-4 text-luxury-gold-600" />
        );
    }
  };

  const handleNotificationClick = async (item) => {
    try {
      // Mark notification as read
      await markAsRead(item.id);

      // If notification belongs to an order,
      // open that order on the Orders page
      if (item.orderId) {
        navigate('/orders', {
          state: {
            orderId: item.orderId
          }
        });
      }
    } catch (err) {
      console.error(
        'Error opening notification:',
        err
      );
    }
  };

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'unread') {
      return !n.read;
    }

    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-5 border-b border-neutral-200 gap-4">

        <div>
          <span className="text-xs uppercase tracking-widest text-luxury-gold-700 font-bold block mb-1">
            Atelier Dispatches
          </span>

          <h1 className="font-serif text-3xl font-bold text-neutral-900 tracking-tight flex items-center gap-3">
            <span>Notifications</span>

            {unreadCount > 0 && (
              <span className="text-xs bg-rose-600 text-white font-sans font-bold px-2 py-0.5 rounded-full">
                {unreadCount} Unread
              </span>
            )}
          </h1>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs font-semibold text-luxury-gold-700 hover:text-luxury-gold-800 uppercase tracking-wider flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />

              <span>
                Mark All as Read
              </span>
            </button>
          )}

          <div className="inline-flex border border-neutral-300 p-0.5 bg-neutral-100 text-xs">

            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 font-semibold uppercase tracking-wider transition-colors ${
                filter === 'all'
                  ? 'bg-luxury-black text-white'
                  : 'text-neutral-600'
              }`}
            >
              All ({notifications.length})
            </button>

            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 font-semibold uppercase tracking-wider transition-colors ${
                filter === 'unread'
                  ? 'bg-luxury-black text-white'
                  : 'text-neutral-600'
              }`}
            >
              Unread ({unreadCount})
            </button>

          </div>
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifs.length === 0 ? (

        <EmptyState
          icon={Bell}
          title="No Notifications"
          description="You are completely up to date with all atelier announcements, fitting schedules, and private collections."
        />

      ) : (

        <div className="bg-white border border-neutral-200/90 shadow-xs divide-y divide-neutral-100">

          {filteredNotifs.map((item) => (

            <div
              key={item.id}
              onClick={() =>
                handleNotificationClick(item)
              }
              className={`p-4 sm:p-5 flex items-start gap-4 transition-colors cursor-pointer ${
                !item.read
                  ? 'bg-luxury-cream-50/70 border-l-4 border-luxury-gold-500'
                  : 'hover:bg-neutral-50'
              }`}
            >

              {/* Icon Container */}
              <div className="w-9 h-9 rounded-full bg-white border border-neutral-200 shadow-xs flex items-center justify-center shrink-0 mt-0.5">
                {getNotifIcon(item.type)}
              </div>

              {/* Body */}
              <div className="flex-1 min-w-0 space-y-1">

                <div className="flex items-center justify-between gap-2">

                  <div className="flex items-center gap-2">

                    <span className="text-[10px] uppercase font-bold tracking-wider text-luxury-gold-700">
                      {item.type}
                    </span>

                    {!item.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                    )}

                  </div>

                  <span className="text-[11px] text-neutral-400 flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" />

                    {formatRelativeTime(
                      item.timestamp
                    )}
                  </span>

                </div>

                <h3 className="font-serif font-bold text-sm text-neutral-900">
                  {item.title}
                </h3>

                <p className="text-xs text-neutral-600 leading-relaxed">
                  {item.message}
                </p>

                {/* Legacy notification link support */}
                {item.link && (
                  <div className="pt-1.5">

                    <Link
                      to={item.link}
                      onClick={(event) =>
                        event.stopPropagation()
                      }
                      className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-luxury-gold-700 hover:text-luxury-gold-900"
                    >
                      <span>
                        Explore Update
                      </span>

                      <ArrowRight className="w-3 h-3" />
                    </Link>

                  </div>
                )}

              </div>
            </div>

          ))}

        </div>
      )}

    </div>
  );
};
