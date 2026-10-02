import { formatPrice } from './formatters';
import { trackEvent } from './analytics';

/**
 * Configurable Owner WhatsApp placeholder number.
 * Defaults to environment variable or placeholder number.
 * NEVER hardcode a real personal phone number.
 */
export const OWNER_WHATSAPP_NUMBER = import.meta.env.VITE_OWNER_WHATSAPP_NUMBER || "+919876543210";

/**
 * Generates an elegant, structured WhatsApp message for order confirmation.
 * @param {Object} order - Order data object
 * @returns {string} Formatted text message
 */
export const createOrderMessage = (order) => {
  const itemsText = (order.items || [])
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.name}*\n   • Size: ${item.size} | Color: ${item.color}\n   • Qty: ${item.quantity} × ${formatPrice(item.price)} = ${formatPrice(item.price * item.quantity)}`
    )
    .join('\n\n');

  const address = order.shippingAddress || {};
  const formattedAddress = `${address.address || ''}, ${address.city || ''}, ${address.state || ''} - ${address.pincode || ''}`;

  return `✨ *NEW ORDER REQUEST - L-KUSH COUTURE* ✨
----------------------------------------
*Order Reference:* ${order.order_number || order.id}
*Customer Name:* ${order.customerName || 'Valued Client'}
*Phone:* ${order.customerPhone || 'N/A'}
*Delivery Address:* ${formattedAddress}

*Items Ordered:*
${itemsText}

----------------------------------------
*Total Order Value:* ${formatPrice(order.totalAmount)}
${order.note ? `*Special Instructions/Fitting Notes:* ${order.note}\n` : ''}
_Kindly confirm fabric availability, customized sizing details, and estimated delivery timeline. Thank you!_`;
};

/**
 * Generates a pre-filled WhatsApp link for direct product styling inquiries.
 * @param {Object} product - Product data object
 * @returns {string} Pre-filled message
 */
export const createProductInquiryMessage = (product) => {
  return `✨ *L-KUSH COUTURE INQUIRY* ✨
----------------------------------------
Hello, I am inquiring about:
*${product.name}* (Ref: ${product.id})
*Price:* ${formatPrice(product.price)}

I would like to ask about available sizes, custom measurements, and delivery timeline.`;
};

/**
 * Opens WhatsApp with pre-filled order details in a new window/tab.
 * @param {Object} order - The order object
 */
export const openWhatsApp = (order) => {
  try {
    const rawNumber = OWNER_WHATSAPP_NUMBER.replace(/[^0-9]/g, '');
    const message = createOrderMessage(order);
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${rawNumber}?text=${encodedMessage}`;

    // Track analytics event
    trackEvent('whatsapp_order_clicked', {
      orderId: order.id,
      totalAmount: order.totalAmount,
      itemCount: order.items?.length || 0
    });

    window.open(url, '_blank', 'noopener,noreferrer');
  } catch (error) {
    console.error('Error launching WhatsApp:', error);
  }
};

/**
 * Opens WhatsApp for general styling inquiries or product questions.
 * @param {string} customText - Custom text message
 */
export const openWhatsAppCustom = (customText) => {
  try {
    const rawNumber = OWNER_WHATSAPP_NUMBER.replace(/[^0-9]/g, '');
    const encodedMessage = encodeURIComponent(customText);
    const url = `https://wa.me/${rawNumber}?text=${encodedMessage}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch (error) {
    console.error('Error opening WhatsApp chat:', error);
  }
};
