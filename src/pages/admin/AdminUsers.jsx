import React, { useState, useEffect } from 'react';
import { getStorageItem, STORAGE_KEYS } from '../../utils/localStorage';
import { formatPrice, formatDate, formatRelativeTime } from '../../utils/formatters';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Heart,
  ShoppingCart,
  Eye
} from 'lucide-react';

// NOTE: Reads directly from the local mock data store, matching the pattern
// used by orderService/analyticsService. A future backend integration will
// replace this with a dedicated customerService making real API calls.
export const AdminUsers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const data = getStorageItem(STORAGE_KEYS.CUSTOMERS, []);
    setCustomers(data);
    setLoading(false);
  }, []);

  const filteredCustomers = customers.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone && c.phone.toLowerCase().includes(q)) ||
      (c.city && c.city.toLowerCase().includes(q))
    );
  });

  const sortedByValue = [...filteredCustomers].sort(
    (a, b) => (b.totalSpent || 0) - (a.totalSpent || 0)
  );

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center text-luxury-gold-600">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-gold-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-luxury-gold-700 font-bold block mb-1">
            Client Relationship Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Patron Directory ({filteredCustomers.length})
          </h1>
        </div>
      </div>

      {/* Search bar */}
      <div className="bg-white border border-neutral-200/90 p-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone or city..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 focus:outline-none focus:border-luxury-gold-500 bg-white"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-neutral-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-luxury-cream-50 text-neutral-700 uppercase font-bold tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Lifetime Value</th>
                <th className="py-3.5 px-4">Engagement</th>
                <th className="py-3.5 px-4">Last Active</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {sortedByValue.map((customer) => (
                <tr key={customer.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={customer.avatar}
                        alt={customer.name}
                        className="w-8 h-8 rounded-full object-cover border border-neutral-200"
                      />
                      <div>
                        <span className="font-semibold text-neutral-900 block">{customer.name}</span>
                        <span className="text-[11px] text-neutral-400">
                          Joined {formatDate(customer.joinedDate)}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-neutral-700 block flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-neutral-400" /> {customer.email}
                    </span>
                    <span className="text-neutral-500 block flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3 h-3 text-neutral-400" /> {customer.phone}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-neutral-700 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      {customer.city}, {customer.state}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-neutral-900 block">
                      {formatPrice(customer.totalSpent)}
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      {customer.ordersCount || 0} order{customer.ordersCount === 1 ? '' : 's'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3 text-[11px] text-neutral-600">
                      <span className="inline-flex items-center gap-1">
                        <Heart className="w-3 h-3 text-rose-500" /> {customer.wishlistCount || 0}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <ShoppingCart className="w-3 h-3 text-indigo-500" /> {customer.cartCount || 0}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-neutral-500">{formatRelativeTime(customer.lastActive)}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      className="p-1.5 text-neutral-600 hover:text-luxury-gold-700 rounded transition-colors"
                      title="View Client Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-neutral-400">
                    <Users className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                    No patrons match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={selectedCustomer.name}
          subtitle={`Patron since ${formatDate(selectedCustomer.joinedDate)}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-5 text-xs text-neutral-700">
            <div className="flex items-center gap-4">
              <img
                src={selectedCustomer.avatar}
                alt={selectedCustomer.name}
                className="w-16 h-16 rounded-full object-cover border border-neutral-200"
              />
              <div>
                <p className="font-serif font-bold text-neutral-900 text-base">{selectedCustomer.name}</p>
                <Badge variant="gold" size="xs">Registered Patron</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-luxury-cream-50 border border-luxury-gold-300/40">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Contact</span>
                <p className="text-neutral-800">{selectedCustomer.email}</p>
                <p className="text-neutral-800">{selectedCustomer.phone}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Address</span>
                <p className="text-neutral-800 leading-relaxed">
                  {selectedCustomer.address}, {selectedCustomer.city}, {selectedCustomer.state} - {selectedCustomer.pincode}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 border border-neutral-200 text-center">
                <ShoppingBag className="w-4 h-4 mx-auto text-luxury-gold-600 mb-1" />
                <span className="font-bold text-neutral-900 block">{selectedCustomer.ordersCount || 0}</span>
                <span className="text-[10px] text-neutral-400 uppercase">Orders</span>
              </div>
              <div className="p-3 border border-neutral-200 text-center">
                <Heart className="w-4 h-4 mx-auto text-rose-500 mb-1" />
                <span className="font-bold text-neutral-900 block">{selectedCustomer.wishlistCount || 0}</span>
                <span className="text-[10px] text-neutral-400 uppercase">Wishlist</span>
              </div>
              <div className="p-3 border border-neutral-200 text-center">
                <ShoppingCart className="w-4 h-4 mx-auto text-indigo-500 mb-1" />
                <span className="font-bold text-neutral-900 block">{selectedCustomer.cartCount || 0}</span>
                <span className="text-[10px] text-neutral-400 uppercase">In Bag</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
              <span className="text-xs uppercase tracking-wider font-bold text-neutral-800">
                Lifetime Value:
              </span>
              <span className="font-serif font-bold text-xl text-neutral-900">
                {formatPrice(selectedCustomer.totalSpent)}
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
