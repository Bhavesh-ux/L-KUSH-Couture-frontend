import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { formatPrice, formatDateTime } from '../utils/formatters';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { openWhatsAppCustom } from '../utils/whatsapp';
import {
  ShoppingBag,
  Eye,
  MessageSquare,
  Clock,
  ArrowRight,
  XCircle
} from 'lucide-react';

export const Orders = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);

      try {
        if (isAuthenticated) {
          const data = await orderService.getCustomerOrders();

          setOrders(data);

          // Open the order automatically when coming
          // from a notification
          const notificationOrderId =
            location.state?.orderId;

          console.log(
            'Notification Order ID:',
            notificationOrderId
          );

          console.log(
            'Orders from backend:',
            data
          );

          if (notificationOrderId) {
            const matchingOrder = data.find(
              (order) =>
                String(order.id) ===
                String(notificationOrderId)
            );

            if (matchingOrder) {
              setSelectedOrder(matchingOrder);
            }

            // Clear notification navigation state
            // so refresh does not reopen the modal
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname
            );
          }
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error(
          'Error loading orders:',
          err
        );

        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, location.state]);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'delivered':
      case 'Completed':
        return 'success';

      case 'confirmed':
      case 'shipped':
      case 'Confirmed':
      case 'Ready':
        return 'gold';

      case 'processing':
      case 'Processing':
        return 'warning';

      case 'cancelled':
      case 'Cancelled':
        return 'danger';

      case 'pending':
      case 'Pending Confirmation':
      case 'WhatsApp Request Sent':
      default:
        return 'dark';
    }
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

  const getPaymentStatus = (order) => {
    return (
      order?.paymentStatus ||
      order?.payment_status ||
      'pending'
    );
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

  const getOrderReference = (order) => {
    return (
      order?.order_number ||
      order?.id ||
      'N/A'
    );
  };

  const handleInquireOnOrder = (order) => {
    openWhatsAppCustom(
      `Hello L-KUSH Couture, I am inquiring regarding the status of my Order Ref: *${
        getOrderReference(order)
      }* placed on ${formatDateTime(order.date)}.`
    );
  };

  const handleCancelOrder = async (order) => {
    const orderReference =
      getOrderReference(order);

    const confirmed = window.confirm(
      `Are you sure you want to cancel order ${orderReference}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await orderService.cancelOrder(order.id);

      // Refresh orders from backend
      const updatedOrders =
        await orderService.getCustomerOrders();

      setOrders(updatedOrders);

      // Close modal if this order was open
      if (
        selectedOrder &&
        selectedOrder.id === order.id
      ) {
        setSelectedOrder(null);
      }

      window.alert(
        `Order ${orderReference} has been cancelled successfully.`
      );
    } catch (err) {
      console.error(
        'Failed to cancel order:',
        err
      );

      window.alert(
        err.message ||
        'Failed to cancel order.'
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">

      {/* Header */}
      <div className="flex items-end justify-between border-b border-neutral-200 pb-5">

        <div>

          <span className="text-xs uppercase tracking-widest text-luxury-gold-700 font-bold block mb-1">
            Concierge Track & History
          </span>

          <h1 className="font-serif text-3xl font-bold text-neutral-900 tracking-tight">
            My Commissions & Orders ({orders.length})
          </h1>

        </div>

        <Link
          to="/shop"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-luxury-gold-700 hover:text-luxury-gold-800"
        >
          <span>Explore New Creations</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

      </div>

      {/* Loading */}
      {loading ? (

        <LoadingSkeleton
          type="table"
          count={4}
        />

      ) : orders.length === 0 ? (

        /* Empty State */
        <EmptyState
          icon={ShoppingBag}
          title="No Past Orders Found"
          description="You haven't placed any concierge orders yet. Explore our handcrafted luxury collection and initiate your bespoke fitting request."
          actionText="Discover The Collections"
          actionLink="/shop"
        />

      ) : (

        /* Orders List */
        <div className="space-y-4">

          {orders.map((order) => {

            const paymentStatus =
              getPaymentStatus(order);

            return (
              <div
                key={order.id}
                className="bg-white border border-neutral-200/90 shadow-xs hover:border-luxury-gold-500/40 transition-all p-5 sm:p-6"
              >

                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 gap-3">

                  <div className="flex items-center gap-3 flex-wrap">

                    <span className="font-serif font-bold text-base text-neutral-900">
                      {getOrderReference(order)}
                    </span>

                    <Badge
                      variant={getStatusVariant(
                        order.status
                      )}
                    >
                      {getStatusLabel(
                        order.status
                      )}
                    </Badge>

                    {/* Payment Status */}
                    <span
                      className={`px-2 py-1 border text-[10px] font-semibold uppercase tracking-wide ${getPaymentStatusClasses(
                        paymentStatus
                      )}`}
                    >
                      Payment: {getPaymentStatusLabel(
                        paymentStatus
                      )}
                    </span>

                  </div>

                  <div className="text-xs text-neutral-500 flex items-center gap-1">

                    <Clock className="w-3.5 h-3.5" />

                    <span>
                      Placed on {formatDateTime(order.date)}
                    </span>

                  </div>

                </div>

                {/* Items Preview */}
                <div className="py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                  {(order.items || []).map(
                    (item, idx) => (

                      <div
                        key={idx}
                        className="flex gap-3 items-center"
                      >

                        {item.image ? (

                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-18 object-cover object-top border shrink-0"
                          />

                        ) : (

                          <div className="w-14 h-18 border shrink-0 bg-neutral-100 flex items-center justify-center">

                            <ShoppingBag className="w-5 h-5 text-neutral-400" />

                          </div>

                        )}

                        <div className="min-w-0 text-xs">

                          <p className="font-serif font-semibold text-neutral-900 truncate">
                            {item.name}
                          </p>

                          <p className="text-[11px] text-neutral-500">
                            Size: {item.size || 'N/A'} | Color: {item.color || 'N/A'}
                          </p>

                          <p className="text-[11px] font-bold text-neutral-800">
                            {item.quantity} × {formatPrice(item.price)}
                          </p>

                        </div>

                      </div>

                    )
                  )}

                </div>

                {/* Cancel Order */}
                {['pending', 'confirmed'].includes(
                  order.status
                ) && (

                  <button
                    onClick={() =>
                      handleCancelOrder(order)
                    }
                    className="px-3.5 py-1.5 border border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold uppercase tracking-wider text-[11px] inline-flex items-center gap-1.5 transition-colors"
                  >

                    <XCircle className="w-3.5 h-3.5" />

                    <span>
                      Cancel Order
                    </span>

                  </button>

                )}

                {/* Card Footer */}
                <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">

                  <div className="flex items-baseline gap-2">

                    <span className="text-neutral-500">
                      Total Valuation:
                    </span>

                    <span className="text-base font-bold text-neutral-900 font-sans">
                      {formatPrice(
                        order.totalAmount
                      )}
                    </span>

                  </div>

                  <div className="flex items-center gap-2">

                    <button
                      onClick={() =>
                        handleInquireOnOrder(order)
                      }
                      className="px-3.5 py-1.5 border border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-semibold uppercase tracking-wider text-[11px] inline-flex items-center gap-1.5 transition-colors"
                    >

                      <MessageSquare className="w-3.5 h-3.5" />

                      <span>
                        Inquire on WhatsApp
                      </span>

                    </button>

                    <button
                      onClick={() =>
                        setSelectedOrder(order)
                      }
                      className="px-3.5 py-1.5 bg-neutral-900 hover:bg-luxury-black text-white font-semibold uppercase tracking-wider text-[11px] inline-flex items-center gap-1.5 transition-colors"
                    >

                      <Eye className="w-3.5 h-3.5" />

                      <span>
                        View Details
                      </span>

                    </button>

                  </div>

                </div>

              </div>
            );
          })}

        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (

        <Modal
          isOpen={!!selectedOrder}
          onClose={() =>
            setSelectedOrder(null)
          }
          title={`Commission Details: ${getOrderReference(
            selectedOrder
          )}`}
          subtitle={`Placed on ${formatDateTime(
            selectedOrder.date
          )}`}
          maxWidth="max-w-2xl"
        >

          <div className="space-y-6 text-xs text-neutral-700">

            {/* Current Status */}
            <div className="flex justify-between items-center p-3 bg-luxury-cream-50 border border-luxury-gold-300/40">

              <span className="font-semibold text-neutral-800">
                Current Status:
              </span>

              <Badge
                variant={getStatusVariant(
                  selectedOrder.status
                )}
              >
                {getStatusLabel(
                  selectedOrder.status
                )}
              </Badge>

            </div>

            {/* Payment Status */}
            <div className="flex justify-between items-center p-3 bg-white border border-neutral-200">

              <span className="font-semibold text-neutral-800">
                Payment Status:
              </span>

              <span
                className={`px-2.5 py-1 border text-[11px] font-semibold ${getPaymentStatusClasses(
                  getPaymentStatus(selectedOrder)
                )}`}
              >
                {getPaymentStatusLabel(
                  getPaymentStatus(selectedOrder)
                )}
              </span>

            </div>

            {/* Items Table */}
            <div>

              <h4 className="font-serif font-bold text-sm text-neutral-900 uppercase tracking-wider mb-2">
                Ensembles Included
              </h4>

              <div className="divide-y divide-neutral-200 border border-neutral-200">

                {(selectedOrder.items || []).map(
                  (item, i) => (

                    <div
                      key={i}
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
                            Size: {item.size || 'N/A'} | Color: {item.color || 'N/A'}
                          </p>

                        </div>

                      </div>

                      <span className="font-bold text-neutral-900 font-sans">
                        {item.quantity} × {formatPrice(item.price)}
                      </span>

                    </div>

                  )
                )}

              </div>

            </div>

            {/* Shipping Details */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-neutral-50 border border-neutral-200">

              <div>

                <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                  Patron Information
                </span>

                <p className="font-bold text-neutral-900">
                  {selectedOrder.customerName}
                </p>

                <p className="text-neutral-600">
                  {selectedOrder.customerPhone}
                </p>

                <p className="text-neutral-600">
                  {selectedOrder.customerEmail}
                </p>

              </div>

              <div>

                <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                  Delivery Destination
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

            {/* Bespoke Fitting Notes */}
            {selectedOrder.note && (

              <div className="p-3 bg-luxury-cream-50 border border-neutral-200">

                <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">
                  Bespoke Fitting Notes
                </span>

                <p className="italic text-neutral-700">
                  {selectedOrder.note}
                </p>

              </div>

            )}

            {/* Total */}
            <div className="flex justify-between items-baseline pt-3 border-t border-neutral-200">

              <span className="font-bold text-sm uppercase tracking-wider text-neutral-900">
                Total Order Valuation:
              </span>

              <span className="font-serif font-bold text-xl text-neutral-900">
                {formatPrice(
                  selectedOrder.totalAmount
                )}
              </span>

            </div>

            {/* WhatsApp */}
            <div className="flex justify-end gap-2 pt-2">

              <button
                onClick={() =>
                  handleInquireOnOrder(
                    selectedOrder
                  )
                }
                className="px-4 py-2 bg-emerald-600 text-white font-semibold uppercase text-xs inline-flex items-center gap-2 hover:bg-emerald-700 transition-colors"
              >

                <MessageSquare className="w-4 h-4" />

                <span>
                  Message Atelier on WhatsApp
                </span>

              </button>

            </div>

          </div>

        </Modal>

      )}

    </div>
  );
};