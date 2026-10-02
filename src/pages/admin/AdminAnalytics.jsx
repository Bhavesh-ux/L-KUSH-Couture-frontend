import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { formatPrice } from '../../utils/formatters';

import {
  Activity,
  BarChart3,
  MessageSquare,
  TrendingUp,
  Search,
  Package,
  Users,
  ShoppingBag,
  IndianRupee,
  Eye
} from 'lucide-react';

import {
  FunnelChart,
  Funnel,
  LabelList,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';

export const AdminAnalytics = () => {
  const [productAnalytics, setProductAnalytics] = useState([]);
  const [summary, setSummary] = useState(null);
  const [dailyTraffic, setDailyTraffic] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [dateRange, setDateRange] = useState('30');
  const [productMetric, setProductMetric] = useState('views');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');

      try {
        const [products, sum, daily, revenue] = await Promise.all([
          analyticsService.getProductAnalytics(
            dateRange === 'all' ? null : Number(dateRange)
          ),
          analyticsService.getSummary(
            dateRange === 'all' ? null : Number(dateRange)
          ),
          analyticsService.getDailyTraffic(),
          analyticsService.getDailyRevenue()
        ]);

        setProductAnalytics(products);
        setSummary(sum);
        setDailyTraffic(daily);
        setDailyRevenue(revenue);
      } catch (err) {
        console.error('Error loading analytics:', err);

        setError(
          err.message || 'Failed to load analytics data.'
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [dateRange]);

  /*
   * Current real analytics funnel.
   *
   * AI Try-On is intentionally not included because
   * the feature is postponed and no real AI Try-On
   * analytics are being generated yet.
   */
  const funnelData = summary
    ? [
        {
          name: 'Product Views',
          value: summary.productViews
        },
        {
          name: 'Wishlist Adds',
          value: summary.wishlistActivity
        },
        {
          name: 'Bag Additions',
          value: summary.cartActivity
        },
        {
          name: 'WhatsApp Orders',
          value: summary.whatsappOrderRequests
        },
        {
          name: 'Valid Orders',
          value: summary.totalOrders
        },
        {
          name: 'Delivered Orders',
          value: summary.deliveredOrders
        }
      ]
    : [];

  const filteredRevenue = dailyRevenue.filter((item) => {
    if (dateRange === 'all') {
      return true;
    }

    const days = Number(dateRange);

    const itemDate = new Date(item.date);
    const today = new Date();

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - days + 1);

    return itemDate >= startDate;
  });

  const filteredTraffic = dailyTraffic.filter((item) => {
    if (dateRange === 'all') {
      return true;
    }

    const days = Number(dateRange);

    const itemDate = new Date(item.date);
    const today = new Date();

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - days + 1);

    return itemDate >= startDate;
  });

  const filteredProducts = productAnalytics.filter((product) =>
    !search ||
    product.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const productPerformanceData = filteredProducts.map((product) => ({
    name:
      product.name.length > 18
        ? `${product.name.slice(0, 18)}...`
        : product.name,
    value: Number(product[productMetric] || 0)
  }));

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center text-luxury-gold-600">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-gold-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center px-4">
        <div className="text-red-600 text-sm font-semibold">
          Failed to load analytics
        </div>

        <p className="text-neutral-500 text-xs mt-2 max-w-md">
          {error}
        </p>

        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 text-xs font-semibold border border-neutral-300 hover:border-luxury-gold-500 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="pb-4 border-b border-neutral-200">
        <span className="text-xs uppercase tracking-widest text-luxury-gold-700 font-bold block mb-1">
          Deep Business Intelligence
        </span>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
          Analytics Suite
        </h1>
      </div>

      {/* Date Range */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">
          Date Range
        </span>

        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="text-xs border border-neutral-300 px-3 py-2 bg-white focus:outline-none focus:border-luxury-gold-500"
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Discovery-to-Order Funnel */}
      <div className="bg-white border border-neutral-200/90 p-5 sm:p-6 shadow-sm space-y-4">

        <div className="pb-3 border-b border-neutral-100">
          <h3 className="font-serif text-base font-bold text-neutral-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-luxury-gold-600" />
            Discovery-to-Order Conversion Funnel
          </h3>

          <p className="text-[11px] text-neutral-500">
            Current customer activity from product discovery to WhatsApp order requests
          </p>
        </div>

        <div className="h-80 w-full">

          {funnelData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>

                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) {
                      return null;
                    }

                    const item = payload[0];

                    return (
                      <div className="bg-neutral-900 border border-luxury-gold-500 px-3 py-2 shadow-lg">
                        <p className="text-white text-[11px] font-semibold">
                          {item.payload?.name}
                        </p>

                        <p className="text-luxury-gold-400 text-[12px] font-bold mt-1">
                          {Number(item.value || 0).toLocaleString()}
                        </p>
                      </div>
                    );
                  }}
                />

                <Funnel
                  dataKey="value"
                  data={funnelData}
                  isAnimationActive
                >
                  <LabelList
                    position="right"
                    fill="#15151a"
                    stroke="none"
                    dataKey="name"
                    fontSize={11}
                  />
                </Funnel>

              </FunnelChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-neutral-400">
              No analytics data available yet.
            </div>
          )}

        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">

          {/* Total Products */}
          <div className="bg-white border border-neutral-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-neutral-500">
                  Total Products
                </p>

                <p className="text-2xl font-bold text-neutral-900 mt-2">
                  {summary.totalProducts.toLocaleString()}
                </p>
              </div>

              <Package className="w-6 h-6 text-luxury-gold-500" />
            </div>
          </div>

          {/* Customers */}
          <div className="bg-white border border-neutral-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-neutral-500">
                  Customers
                </p>

                <p className="text-2xl font-bold text-neutral-900 mt-2">
                  {summary.totalCustomers.toLocaleString()}
                </p>
              </div>

              <Users className="w-6 h-6 text-luxury-gold-500" />
            </div>
          </div>

          {/* Valid Orders */}
          <div className="bg-white border border-neutral-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-neutral-500">
                  Valid Orders
                </p>

                <p className="text-2xl font-bold text-neutral-900 mt-2">
                  {summary.totalOrders.toLocaleString()}
                </p>
              </div>

              <ShoppingBag className="w-6 h-6 text-luxury-gold-500" />
            </div>
          </div>

          {/* Paid Revenue */}
          <div className="bg-white border border-neutral-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-neutral-500">
                  Paid Revenue
                </p>

                <p className="text-2xl font-bold text-neutral-900 mt-2">
                  {formatPrice(summary.paidRevenue)}
                </p>
              </div>

              <IndianRupee className="w-6 h-6 text-luxury-gold-500" />
            </div>
          </div>

          {/* Product Views */}
          <div className="bg-white border border-neutral-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-neutral-500">
                  Product Views
                </p>

                <p className="text-2xl font-bold text-neutral-900 mt-2">
                  {summary.productViews.toLocaleString()}
                </p>
              </div>

              <Eye className="w-6 h-6 text-luxury-gold-500" />
            </div>
          </div>

        </div>
      )}

      {/* Daily Activity Analytics */}
      <div className="bg-white border border-neutral-200/90 p-5 sm:p-6 shadow-sm space-y-4">

        <div className="pb-3 border-b border-neutral-100">

          <h3 className="font-serif text-base font-bold text-neutral-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-luxury-gold-600" />
            Daily Customer Activity
          </h3>

          <p className="text-[11px] text-neutral-500">
            Real daily activity recorded from PostgreSQL analytics events
          </p>

        </div>

        {/* Revenue Analytics */}
        <div className="bg-white border border-neutral-200/90 p-5 sm:p-6 shadow-sm space-y-4">

          <div className="pb-3 border-b border-neutral-100">

            <h3 className="font-serif text-base font-bold text-neutral-900 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-luxury-gold-600" />
              Revenue Analytics
            </h3>

            <p className="text-[11px] text-neutral-500">
              Daily paid revenue from valid non-cancelled orders
            </p>

          </div>

          <div className="h-80 w-full">

            {filteredRevenue.length > 0 ? (

              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredRevenue}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 30,
                    bottom: 10
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e5e5"
                  />

                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short'
                      })
                    }
                    tick={{
                      fontSize: 10,
                      fill: '#737373'
                    }}
                  />

                  <YAxis
                    tick={{
                      fontSize: 10,
                      fill: '#737373'
                    }}
                    tickFormatter={(value) => formatPrice(value)}
                  />

                  <Tooltip
                    formatter={(value) => [
                      formatPrice(value),
                      'Revenue'
                    ]}
                    contentStyle={{
                      backgroundColor: '#15151a',
                      color: '#fff',
                      border: '1px solid #c5a059',
                      fontSize: '11px'
                    }}
                  />

                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    fill="#c5a059"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>

            ) : (

              <div className="h-full flex items-center justify-center text-sm text-neutral-400">
                No revenue data available yet.
              </div>

            )}

          </div>

        </div>

        {/* Daily Customer Activity Chart */}
        <div className="h-80 w-full">

          {filteredTraffic.length > 0 ? (

            <ResponsiveContainer width="100%" height="100%">

              <LineChart
                data={filteredTraffic}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 5
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e5e5"
                />

                <XAxis
                  dataKey="date"
                  tick={{
                    fontSize: 10,
                    fill: '#737373'
                  }}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fontSize: 10,
                    fill: '#737373'
                  }}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#15151a',
                    color: '#fff',
                    border: '1px solid #c5a059',
                    fontSize: '11px'
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="productViews"
                  name="Product Views"
                  stroke="#15151a"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />

                <Line
                  type="monotone"
                  dataKey="wishlistAdds"
                  name="Wishlist Adds"
                  stroke="#c5a059"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />

                <Line
                  type="monotone"
                  dataKey="cartAdds"
                  name="Bag Adds"
                  stroke="#737373"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />

                <Line
                  type="monotone"
                  dataKey="whatsappClicks"
                  name="WhatsApp Orders"
                  stroke="#404040"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />

              </LineChart>

            </ResponsiveContainer>

          ) : (

            <div className="h-full flex items-center justify-center text-sm text-neutral-400">
              No daily analytics data available yet.
            </div>

          )}

        </div>

      </div>

      {/* Product Performance Graph */}
      <div className="bg-white border border-neutral-200/90 p-5 sm:p-6 shadow-sm space-y-4">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">

          <div>
            <h3 className="font-serif text-base font-bold text-neutral-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-luxury-gold-600" />
              Product Performance
            </h3>

            <p className="text-[11px] text-neutral-500 mt-1">
              Compare real product activity recorded in PostgreSQL
            </p>
          </div>

          <select
            value={productMetric}
            onChange={(e) => setProductMetric(e.target.value)}
            className="text-xs border border-neutral-300 px-3 py-2 bg-white focus:outline-none focus:border-luxury-gold-500"
          >
            <option value="views">Product Views</option>
            <option value="wishlistAdds">Wishlist Adds</option>
            <option value="cartAdds">Bag Adds</option>
            <option value="whatsappClicks">WhatsApp Clicks</option>
            <option value="orders">Orders</option>
          </select>

        </div>

        <div className="h-80 w-full">

          {productPerformanceData.length > 0 ? (

            <ResponsiveContainer width="100%" height="100%">

              <BarChart
                data={productPerformanceData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 50
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e5e5"
                />

                <XAxis
                  dataKey="name"
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                  height={70}
                  tick={{
                    fontSize: 10,
                    fill: '#737373'
                  }}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fontSize: 10,
                    fill: '#737373'
                  }}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#15151a',
                    color: '#fff',
                    border: '1px solid #c5a059',
                    fontSize: '11px'
                  }}
                />

                <Bar
                  dataKey="value"
                  name={
                    productMetric === 'views'
                      ? 'Product Views'
                      : productMetric === 'wishlistAdds'
                        ? 'Wishlist Adds'
                        : productMetric === 'cartAdds'
                          ? 'Bag Adds'
                          : productMetric === 'whatsappClicks'
                            ? 'WhatsApp Clicks'
                            : 'Orders'
                  }
                  fill="#c5a059"
                  radius={[3, 3, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          ) : (

            <div className="h-full flex items-center justify-center text-sm text-neutral-400">
              No product analytics data available yet.
            </div>

          )}

        </div>

      </div>

      {/* Product-Level Analytics */}
      <div className="bg-white border border-neutral-200/90 shadow-sm overflow-hidden">

        {/* Table Header */}
        <div className="p-4 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

          <h3 className="font-serif text-base font-bold text-neutral-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-luxury-gold-600" />
            Product-Level Analytics
          </h3>

          <div className="relative w-full sm:w-64">

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search garment..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 focus:outline-none focus:border-luxury-gold-500"
            />

            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />

          </div>

        </div>

        {/* Product Table */}
        <div className="overflow-x-auto">

          <table className="w-full text-left text-xs">

            <thead>

              <tr className="border-b border-neutral-200 bg-luxury-cream-50 text-neutral-700 uppercase font-bold tracking-wider text-[11px]">

                <th className="py-3 px-4">
                  Garment
                </th>

                <th className="py-3 px-4">
                  Views
                </th>

                <th className="py-3 px-4">
                  Wishlist
                </th>

                <th className="py-3 px-4">
                  Bag Adds
                </th>

                <th className="py-3 px-4">
                  WhatsApp Clicks
                </th>

                <th className="py-3 px-4">
                  Orders
                </th>

                <th className="py-3 px-4">
                  Conversion
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-neutral-100">

              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (

                  <tr
                    key={product.id}
                    className="hover:bg-neutral-50/70 transition-colors"
                  >

                    {/* Product */}
                    <td className="py-3 px-4">

                      <div className="flex items-center gap-3">

                        <div className="w-8 h-10 border border-neutral-200 bg-neutral-100 flex items-center justify-center shrink-0">
                          <span className="text-[8px] text-neutral-400">
                            L-K
                          </span>
                        </div>

                        <div>

                          <span className="font-semibold text-neutral-900 block">
                            {product.name}
                          </span>

                          <span className="text-[11px] text-neutral-400">
                            {formatPrice(product.price)}
                          </span>

                        </div>

                      </div>

                    </td>

                    {/* Views */}
                    <td className="py-3 px-4 text-neutral-700">
                      {Number(product.views || 0).toLocaleString()}
                    </td>

                    {/* Wishlist */}
                    <td className="py-3 px-4 text-neutral-700">
                      {Number(product.wishlistAdds || 0).toLocaleString()}
                    </td>

                    {/* Cart */}
                    <td className="py-3 px-4 text-neutral-700">
                      {Number(product.cartAdds || 0).toLocaleString()}
                    </td>

                    {/* WhatsApp */}
                    <td className="py-3 px-4 text-neutral-700">
                      {Number(product.whatsappClicks || 0).toLocaleString()}
                    </td>

                    {/* Orders */}
                    <td className="py-3 px-4 text-neutral-700">
                      {Number(product.orders || 0).toLocaleString()}
                    </td>

                    {/* Conversion */}
                    <td className="py-3 px-4 font-bold text-luxury-gold-700">
                      {product.conversionRate || '0%'}
                    </td>

                  </tr>

                ))
              ) : (

                <tr>

                  <td
                    colSpan="7"
                    className="py-12 text-center text-neutral-400"
                  >
                    {search
                      ? 'No products found for your search.'
                      : 'No product analytics available yet.'}
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>
      </div>

      {/* Analytics Information */}
      <div className="bg-neutral-50 border border-neutral-200 p-5 sm:p-6">

        <div className="flex items-start gap-3">

          <MessageSquare className="w-5 h-5 text-luxury-gold-600 mt-0.5 shrink-0" />

          <div>

            <h3 className="text-sm font-semibold text-neutral-900">
              Analytics Tracking
            </h3>

            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Product views, wishlist activity, bag additions and
              WhatsApp order requests are currently being collected
              from the real analytics events stored in PostgreSQL.
            </p>

            <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
              Visitor counts and AI Try-On analytics are not shown
              until their respective tracking systems are implemented.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};