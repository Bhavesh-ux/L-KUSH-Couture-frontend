import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { formatPrice, formatDateTime } from '../../utils/formatters';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';
import {
  ShoppingBag,
  Search,
  MessageSquare,
  Eye
} from 'lucide-react';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { addToast } = useToast();

  // Backend status values
  const statuses = [
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled'
  ];

  const getOrderReference = (order) => {
    return order?.order_number || order?.id || 'N/A';
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending Confirmation';

      case 'confirmed':
        return 'Confirmed';

      case 'processing':
        return 'Processing';

      case 'shipped':
        return 'Shipped';

      case 'delivered':
        return 'Delivered';

      case 'cancelled':
        return 'Cancelled';

      default:
        return status || 'Pending Confirmation';
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case 'delivered':
        return 'border-emerald-300 bg-emerald-50 text-emerald-800';

      case 'cancelled':
        return 'border-rose-300 bg-rose-50 text-rose-800';

      case 'confirmed':
      case 'shipped':
        return 'border-luxury-gold-300 bg-luxury-cream-50 text-luxury-gold-800';

      case 'processing':
        return 'border-amber-300 bg-amber-50 text-amber-800';

      case 'pending':
      default:
        return 'border-neutral-300 bg-white text-neutral-800';
    }
  };

  const getPaymentStatusLabel = (status) => {
    switch (status) {
      case 'paid':
        return 'Paid';

      case 'failed':
        return 'Failed';

      case 'refunded':
        return 'Refunded';

      case 'pending':
      default:
        return 'Pending';
    }
  };

  const getPaymentStatusClasses = (status) => {
    switch (status) {
      case 'paid':
        return 'border-emerald-300 bg-emerald-50 text-emerald-800';

      case 'failed':
        return 'border-rose-300 bg-rose-50 text-rose-800';

      case 'refunded':
        return 'border-purple-300 bg-purple-50 text-purple-800';

      case 'pending':
      default:
        return 'border-neutral-300 bg-white text-neutral-800';
    }
  };

  const fetchOrders = async () => {
    setLoading(true);

    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Error loading admin orders:', err);

      addToast(
        err.message || 'Failed to load orders',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(
        orderId,
        newStatus
      );

      addToast(
        `Order updated to "${getStatusLabel(newStatus)}"`,
        'success'
      );

      await fetchOrders();

      if (
        selectedOrder &&
        selectedOrder.id === orderId
      ) {
        setSelectedOrder((prev) => ({
          ...prev,
          status: newStatus
        }));
      }
    } catch (err) {
      console.error(
        'Failed to update order status:',
        err
      );

      addToast(
        err.message || 'Failed to update status',
        'error'
      );
    }
  };

  const handlePaymentStatusChange = async (
    orderId,
    newPaymentStatus
  ) => {
    try {
      await orderService.updatePaymentStatus(
        orderId,
        newPaymentStatus
      );

      addToast(
        `Payment status updated to "${getPaymentStatusLabel(
          newPaymentStatus
        )}"`,
        'success'
      );

      await fetchOrders();

      if (
        selectedOrder &&
        selectedOrder.id === orderId
      ) {
        setSelectedOrder((prev) => ({
          ...prev,
          paymentStatus: newPaymentStatus,
          payment_status: newPaymentStatus
        }));
      }
    } catch (err) {
      console.error(
        'Failed to update payment status:',
        err
      );

      addToast(
        err.message ||
          'Failed to update payment status',
        'error'
      );
    }
  };

  const handleOpenCustomerWhatsApp = (order) => {
    const rawPhone = String(
      order?.customerPhone || ''
    ).replace(/[^0-9]/g, '');

    if (!rawPhone) {
      addToast(
        'Customer phone number is not available',
        'error'
      );
      return;
    }

    const orderReference =
      getOrderReference(order);

    const msg = encodeURIComponent(
      `Hello ${order.customerName}, this is L-KUSH Couture regarding your order *${orderReference}*. We are reviewing your fitting specifications.`
    );

    window.open(
      `https://wa.me/${rawPhone}?text=${msg}`,
      '_blank'
    );
  };

  const filteredOrders = orders.filter((order) => {
    const searchText =
      search.trim().toLowerCase();

    if (!searchText) {
      return (
        statusFilter === 'all' ||
        order.status === statusFilter
      );
    }

    const orderReference = String(
      order.order_number ||
        order.id ||
        ''
    ).toLowerCase();

    const customerName = String(
      order.customerName || ''
    ).toLowerCase();

    const customerPhone = String(
      order.customerPhone || ''
    ).toLowerCase();

    const city = String(
      order.shippingAddress?.city || ''
    ).toLowerCase();

    const matchesSearch =
      orderReference.includes(searchText) ||
      customerName.includes(searchText) ||
      customerPhone.includes(searchText) ||
      city.includes(searchText);

    const matchesStatus =
      statusFilter === 'all' ||
      order.status === statusFilter;

    return (
      matchesSearch &&
      matchesStatus
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-4">

        <div>
          <span className="text-xs uppercase tracking-widest text-luxury-gold-700 font-bold block mb-1">
            Order Fulfillment & WhatsApp Concierge
          </span>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Commissions & Orders ({filteredOrders.length})
          </h1>
        </div>

      </div>

      {/* Filter bar */}
      <div className="bg-white border border-neutral-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">

        <div className="relative w-full sm:w-72">

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search Order Ref, Patron, Phone or City..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 focus:outline-none focus:border-luxury-gold-500 bg-white"
          />

          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />

        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="bg-white border border-neutral-300 text-xs py-2 px-3 focus:outline-none focus:border-luxury-gold-500 text-neutral-800"
          >

            <option value="all">
              All Order Statuses
            </option>

            {statuses.map((status) => (
              <option
                key={status}
                value={status}
              >
                {getStatusLabel(status)}
              </option>
            ))}

          </select>

        </div>

      </div>

      {/* Orders Table */}
      <div className="bg-white border border-neutral-200/90 shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-left text-xs">

            <thead>

              <tr className="border-b border-neutral-200 bg-luxury-cream-50 text-neutral-700 uppercase font-bold tracking-wider text-[11px]">

                <th className="py-3.5 px-4">
                  Order Reference & Date
                </th>

                <th className="py-3.5 px-4">
                  Client
                </th>

                <th className="py-3.5 px-4">
                  Ensembles Ordered
                </th>

                <th className="py-3.5 px-4">
                  Valuation
                </th>

                <th className="py-3.5 px-4">
                  WhatsApp Status
                </th>

                <th className="py-3.5 px-4">
                  Payment Status
                </th>

                <th className="py-3.5 px-4">
                  Fulfillment Status
                </th>

                <th className="py-3.5 px-4 text-right">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-neutral-100">

              {loading ? (

                <tr>

                  <td
                    colSpan="8"
                    className="py-12 text-center text-neutral-500"
                  >
                    Loading orders...
                  </td>

                </tr>

              ) : filteredOrders.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    className="py-12 text-center text-neutral-500"
                  >
                    No orders found.
                  </td>

                </tr>

              ) : (

                filteredOrders.map((order) => (

                  <tr
                    key={order.id}
                    className="hover:bg-neutral-50/70 transition-colors"
                  >

                    {/* Order Reference & Date */}
                    <td className="py-3 px-4">

                      <span className="font-bold text-neutral-900 block font-mono">
                        {getOrderReference(order)}
                      </span>

                      <span className="text-[11px] text-neutral-400">
                        {formatDateTime(order.date)}
                      </span>

                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4">

                      <span className="font-semibold text-neutral-900 block">
                        {order.customerName}
                      </span>

                      <span className="text-[11px] text-neutral-500 block">
                        {order.customerPhone}
                      </span>

                      <span className="text-[11px] text-neutral-400 block">
                        {order.shippingAddress?.city}
                        {order.shippingAddress?.city &&
                        order.shippingAddress?.state
                          ? ', '
                          : ''}
                        {order.shippingAddress?.state}
                      </span>

                    </td>

                    {/* Ensembles */}
                    <td className="py-3 px-4">

                      <div className="space-y-2">

                        {(order.items || []).map(
                          (item, index) => (

                            <div
                              key={
                                item.id || index
                              }
                              className="flex items-center gap-2"
                            >

                              {item.image ? (

                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-9 h-12 object-cover object-top border shrink-0"
                                />

                              ) : (

                                <div className="w-9 h-12 border bg-neutral-100 flex items-center justify-center shrink-0">
                                  <ShoppingBag className="w-3.5 h-3.5 text-neutral-400" />
                                </div>

                              )}

                              <div className="min-w-0">

                                <span className="font-medium text-neutral-900 block">
                                  {item.name}
                                </span>

                                <span className="text-neutral-400 block">
                                  Size: {item.size || 'N/A'}
                                  {' | '}
                                  Color: {item.color || 'N/A'}
                                  {' × '}
                                  {item.quantity}
                                </span>

                              </div>

                            </div>

                          )
                        )}

                      </div>

                    </td>

                    {/* Valuation */}
                    <td className="py-3 px-4 font-bold text-neutral-900 font-sans">

                      {formatPrice(
                        order.totalAmount
                      )}

                    </td>

                    {/* WhatsApp Status */}
                    <td className="py-3 px-4">

                      <span className="text-[11px] text-emerald-700 font-medium inline-flex items-center gap-1">

                        <MessageSquare className="w-3 h-3 text-emerald-600" />

                        <span>
                          {order.whatsappStatus ||
                            'Request Sent'}
                        </span>

                      </span>

                    </td>

                    {/* Payment Status */}
                    <td className="py-3 px-4">

                      <select
                        value={
                          order.paymentStatus ||
                          order.payment_status ||
                          'pending'
                        }
                        onChange={(e) =>
                          handlePaymentStatusChange(
                            order.id,
                            e.target.value
                          )
                        }
                        className={`text-xs py-1 px-2 border font-semibold focus:outline-none ${getPaymentStatusClasses(
                          order.paymentStatus ||
                            order.payment_status ||
                            'pending'
                        )}`}
                      >

                        <option value="pending">
                          Pending
                        </option>

                        <option value="paid">
                          Paid
                        </option>

                        <option value="failed">
                          Failed
                        </option>

                        <option value="refunded">
                          Refunded
                        </option>

                      </select>

                    </td>

                    {/* Fulfillment Status */}
                    <td className="py-3 px-4">

                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(
                            order.id,
                            e.target.value
                          )
                        }
                        className={`text-xs py-1 px-2 border font-semibold focus:outline-none ${getStatusClasses(
                          order.status
                        )}`}
                      >

                        {statuses.map((status) => (

                          <option
                            key={status}
                            value={status}
                          >
                            {getStatusLabel(status)}
                          </option>

                        ))}

                      </select>

                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">

                      <div className="inline-flex items-center gap-1.5">

                        <button
                          onClick={() =>
                            handleOpenCustomerWhatsApp(
                              order
                            )
                          }
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                          title="Chat with Customer on WhatsApp"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() =>
                            setSelectedOrder(order)
                          }
                          className="p-1.5 text-neutral-600 hover:text-luxury-gold-700 rounded transition-colors"
                          title="View Full Order Specifications"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Order Details Modal */}
      {selectedOrder && (

        <Modal
          isOpen={!!selectedOrder}
          onClose={() =>
            setSelectedOrder(null)
          }
          title={`Order Dossier: ${getOrderReference(
            selectedOrder
          )}`}
          subtitle={`Commissioned on ${formatDateTime(
            selectedOrder.date
          )}`}
          maxWidth="max-w-2xl"
        >

          <div className="space-y-6 text-xs text-neutral-700">

            {/* Customer + Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-luxury-cream-50 border border-luxury-gold-300/40">

              <div>

                <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                  Patron Coordinates
                </span>

                <p className="font-bold text-neutral-900 text-sm">
                  {selectedOrder.customerName}
                </p>

                <p className="text-neutral-700">
                  {selectedOrder.customerPhone}
                </p>

                <p className="text-neutral-700">
                  {selectedOrder.customerEmail}
                </p>

              </div>

              <div>

                <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                  Destination Address
                </span>

                <p className="text-neutral-800 leading-relaxed">
                  {selectedOrder.shippingAddress?.address}

                  {selectedOrder.shippingAddress?.city
                    ? `, ${selectedOrder.shippingAddress.city}`
                    : ''}

                  {selectedOrder.shippingAddress?.state
                    ? `, ${selectedOrder.shippingAddress.state}`
                    : ''}

                  {selectedOrder.shippingAddress?.pincode
                    ? ` - ${selectedOrder.shippingAddress.pincode}`
                    : ''}
                </p>

              </div>

            </div>

            {/* Order Status */}
            <div className="flex justify-between items-center p-3 bg-luxury-cream-50 border border-luxury-gold-300/40">

              <span className="font-semibold text-neutral-800">
                Current Status:
              </span>

              <span
                className={`px-2.5 py-1 border text-[11px] font-semibold ${getStatusClasses(
                  selectedOrder.status
                )}`}
              >
                {getStatusLabel(
                  selectedOrder.status
                )}
              </span>

            </div>

            {/* Payment Status */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-3 bg-white border border-neutral-200">

              <div>

                <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                  Payment Status
                </span>

                <span
                  className={`inline-flex px-2.5 py-1 border text-[11px] font-semibold ${getPaymentStatusClasses(
                    selectedOrder.paymentStatus ||
                      selectedOrder.payment_status ||
                      'pending'
                  )}`}
                >
                  {getPaymentStatusLabel(
                    selectedOrder.paymentStatus ||
                      selectedOrder.payment_status ||
                      'pending'
                  )}
                </span>

              </div>

              <select
                value={
                  selectedOrder.paymentStatus ||
                  selectedOrder.payment_status ||
                  'pending'
                }
                onChange={(e) =>
                  handlePaymentStatusChange(
                    selectedOrder.id,
                    e.target.value
                  )
                }
                className={`p-1.5 border text-xs font-bold focus:outline-none ${getPaymentStatusClasses(
                  selectedOrder.paymentStatus ||
                    selectedOrder.payment_status ||
                    'pending'
                )}`}
              >

                <option value="pending">
                  Pending
                </option>

                <option value="paid">
                  Paid
                </option>

                <option value="failed">
                  Failed
                </option>

                <option value="refunded">
                  Refunded
                </option>

              </select>

            </div>

            {/* Note */}
            {selectedOrder.note && (

              <div className="p-3 bg-white border border-neutral-200">

                <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                  Custom Fitting Notes
                </span>

                <p className="italic text-neutral-800">
                  {selectedOrder.note}
                </p>

              </div>

            )}

            {/* Items */}
            <div>

              <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-neutral-900 mb-2">
                Ensembles Breakdown
              </h4>

              <div className="divide-y divide-neutral-200 border border-neutral-200">

                {(selectedOrder.items || []).map(
                  (item, index) => (

                    <div
                      key={
                        item.id || index
                      }
                      className="p-3 flex items-center justify-between gap-3"
                    >

                      <div className="flex items-center gap-3">

                        {item.image ? (

                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-16 object-cover object-top border"
                          />

                        ) : (

                          <div className="w-12 h-16 border bg-neutral-100 flex items-center justify-center">
                            <ShoppingBag className="w-4 h-4 text-neutral-400" />
                          </div>

                        )}

                        <div>

                          <p className="font-serif font-bold text-neutral-900">
                            {item.name}
                          </p>

                          <p className="text-[11px] text-neutral-500">
                            Size: {item.size || 'N/A'}
                            {' | '}
                            Color: {item.color || 'N/A'}
                          </p>

                          <p className="text-[11px] text-neutral-500">
                            Quantity: {item.quantity}
                          </p>

                        </div>

                      </div>

                      <span className="font-bold text-neutral-900 font-sans whitespace-nowrap">
                        {item.quantity} ×{' '}
                        {formatPrice(item.price)}
                      </span>

                    </div>

                  )
                )}

              </div>

            </div>

            {/* Total */}
            <div className="flex items-center justify-between pt-3 border-t border-neutral-200">

              <span className="text-xs uppercase tracking-wider font-bold text-neutral-800">
                Total Order Amount:
              </span>

              <span className="font-serif font-bold text-xl text-neutral-900">
                {formatPrice(
                  selectedOrder.totalAmount
                )}
              </span>

            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">

              <div className="flex items-center gap-2">

                <span className="text-xs font-semibold text-neutral-700">
                  Update Status:
                </span>

                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleStatusChange(
                      selectedOrder.id,
                      e.target.value
                    )
                  }
                  className={`p-1.5 border text-xs font-bold ${getStatusClasses(
                    selectedOrder.status
                  )}`}
                >

                  {statuses.map((status) => (

                    <option
                      key={status}
                      value={status}
                    >
                      {getStatusLabel(status)}
                    </option>

                  ))}

                </select>

              </div>

              <button
                onClick={() =>
                  handleOpenCustomerWhatsApp(
                    selectedOrder
                  )
                }
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-xs inline-flex items-center gap-2"
              >

                <MessageSquare className="w-4 h-4" />

                <span>
                  Message Client on WhatsApp
                </span>

              </button>

            </div>

          </div>

        </Modal>

      )}

    </div>
  );
};