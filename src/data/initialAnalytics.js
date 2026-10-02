export const initialAnalytics = {
  summary: {
    totalProducts: 32,
    totalCustomers: 10,
    totalOrders: 20,
    whatsappOrderRequests: 48,
    productViews: 14280,
    wishlistActivity: 840,
    cartActivity: 460,
    aiTryOns: 685,
    visitors: 9340
  },
  dailyTraffic: [
    { date: "03/07", visitors: 380, pageViews: 940, tryOns: 32, whatsappClicks: 3 },
    { date: "03/08", visitors: 420, pageViews: 1100, tryOns: 45, whatsappClicks: 5 },
    { date: "03/09", visitors: 390, pageViews: 980, tryOns: 38, whatsappClicks: 4 },
    { date: "03/10", visitors: 460, pageViews: 1250, tryOns: 52, whatsappClicks: 6 },
    { date: "03/11", visitors: 510, pageViews: 1390, tryOns: 61, whatsappClicks: 7 },
    { date: "03/12", visitors: 480, pageViews: 1210, tryOns: 54, whatsappClicks: 5 },
    { date: "03/13", visitors: 540, pageViews: 1460, tryOns: 68, whatsappClicks: 8 },
    { date: "03/14", visitors: 610, pageViews: 1680, tryOns: 79, whatsappClicks: 9 },
    { date: "03/15", visitors: 680, pageViews: 1890, tryOns: 85, whatsappClicks: 11 },
    { date: "03/16", visitors: 590, pageViews: 1540, tryOns: 72, whatsappClicks: 8 },
    { date: "03/17", visitors: 640, pageViews: 1720, tryOns: 80, whatsappClicks: 10 },
    { date: "03/18", visitors: 710, pageViews: 1950, tryOns: 94, whatsappClicks: 12 },
    { date: "03/19", visitors: 760, pageViews: 2110, tryOns: 102, whatsappClicks: 14 },
    { date: "03/20", visitors: 820, pageViews: 2340, tryOns: 115, whatsappClicks: 16 }
  ],
  categoryPerformance: [
    { name: "Sherwani", views: 4250, sales: 12, value: 458000 },
    { name: "Indo-Western", views: 3680, sales: 9, value: 215000 },
    { name: "Kurta Pajama", views: 2940, sales: 8, value: 106000 },
    { name: "Wedding", views: 2820, sales: 7, value: 288000 },
    { name: "Blazer", views: 2180, sales: 5, value: 98000 },
    { name: "Festive", views: 2450, sales: 6, value: 74000 },
    { name: "Kurta", views: 1890, sales: 4, value: 37000 },
    { name: "Party Wear", views: 1620, sales: 3, value: 49000 }
  ],
  topTriedAttires: [
    { id: "lk-001", name: "Royal Velvet Zardozi Sherwani", tryOns: 164, conversionRate: 14.2 },
    { id: "lk-003", name: "Asymmetric Draped Indo-Western", tryOns: 142, conversionRate: 11.8 },
    { id: "lk-004", name: "Heritage Benarasi Brocade Achkan", tryOns: 118, conversionRate: 16.5 },
    { id: "lk-010", name: "Imperial Brocade Groom Sherwani", tryOns: 98, conversionRate: 19.1 },
    { id: "lk-008", name: "Rose Gold Sequin Festive Kurta", tryOns: 86, conversionRate: 9.4 }
  ],
  funnelData: [
    { stage: "Store Visitors", count: 9340, percent: 100 },
    { stage: "Product Page Views", count: 6820, percent: 73 },
    { stage: "AI Try-On Generated", count: 685, percent: 10 },
    { stage: "Added to Cart / Wishlist", count: 1300, percent: 14 },
    { stage: "WhatsApp Order Inquiry", count: 48, percent: 0.51 },
    { stage: "Order Confirmed", count: 20, percent: 0.21 }
  ]
};
