import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import { useToast } from '../../components/common/Toast';
import { formatDateTime } from '../../utils/formatters';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Bell, Send, Megaphone, Tag, Sparkles, Package } from 'lucide-react';

const NOTIF_TYPES = [
  { value: 'promo', label: 'Promotional Offer', icon: Tag },
  { value: 'seasonal', label: 'Seasonal Update', icon: Sparkles },
  { value: 'store', label: 'Store Update', icon: Package },
  { value: 'general', label: 'General Announcement', icon: Megaphone }
];

export const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', type: 'promo' });
  const { addToast } = useToast();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) {
      addToast('Please provide a title and message before broadcasting.', 'error');
      return;
    }

    setSending(true);
    try {
      await notificationService.createNotification({
        title: form.title,
        message: form.message,
        type: form.type
      });
      addToast('Broadcast published to all patrons.', 'success');
      setForm({ title: '', message: '', type: 'promo' });
      fetchNotifications();
    } catch (err) {
      addToast('Failed to publish broadcast.', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-neutral-200">
        <span className="text-xs uppercase tracking-widest text-luxury-gold-700 font-bold block mb-1">
          Patron Communication
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
          Notification Broadcaster
        </h1>
      </div>

      {/* Compose Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-neutral-200/90 p-5 sm:p-6 shadow-sm space-y-5"
      >
        <h3 className="font-serif text-base font-bold text-neutral-900 flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-luxury-gold-600" />
          Compose New Broadcast
        </h3>

        <div>
          <label className="text-[11px] uppercase font-bold text-neutral-500 block mb-2">
            Broadcast Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {NOTIF_TYPES.map((t) => {
              const Icon = t.icon;
              const isActive = form.type === t.value;
              return (
                <button
                  type="button"
                  key={t.value}
                  onClick={() => setForm((f) => ({ ...f, type: t.value }))}
                  className={`flex flex-col items-center gap-1.5 p-3 border text-[11px] font-semibold uppercase tracking-wide transition-colors ${
                    isActive
                      ? 'border-luxury-gold-500 bg-luxury-gold-50 text-luxury-gold-800'
                      : 'border-neutral-200 text-neutral-500 hover:border-neutral-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-[11px] uppercase font-bold text-neutral-500 block mb-2">
            Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Festive Season Collection is Live"
            className="w-full px-3 py-2.5 text-sm border border-neutral-300 focus:outline-none focus:border-luxury-gold-500"
          />
        </div>

        <div>
          <label className="text-[11px] uppercase font-bold text-neutral-500 block mb-2">
            Message
          </label>
          <textarea
            rows={4}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            placeholder="Write your announcement to all patrons..."
            className="w-full px-3 py-2.5 text-sm border border-neutral-300 focus:outline-none focus:border-luxury-gold-500 resize-none"
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="gold" icon={Send} loading={sending}>
            Publish Broadcast
          </Button>
        </div>
      </form>

      {/* History */}
      <div className="bg-white border border-neutral-200/90 shadow-sm">
        <div className="p-4 border-b border-neutral-200">
          <h3 className="font-serif text-base font-bold text-neutral-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-luxury-gold-600" />
            Broadcast History
          </h3>
        </div>

        {loading ? (
          <div className="py-12 flex items-center justify-center text-luxury-gold-600">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-luxury-gold-500" />
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {notifications.length === 0 && (
              <p className="text-center text-neutral-400 py-10 text-xs">No broadcasts published yet.</p>
            )}
            {notifications.map((n) => (
              <div key={n.id} className="p-4 flex items-start justify-between gap-4 hover:bg-neutral-50/70">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-neutral-900 text-sm">{n.title}</span>
                    <Badge variant={n.type === 'promo' ? 'gold' : 'outline'} size="xs">
                      {n.type || 'general'}
                    </Badge>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">{n.message}</p>
                </div>
                <span className="text-[11px] text-neutral-400 whitespace-nowrap shrink-0">
                  {formatDateTime(n.timestamp)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
