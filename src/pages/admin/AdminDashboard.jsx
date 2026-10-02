
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../../services/analyticsService';
import { formatPrice } from '../../utils/formatters';

import {
  Package,
  Users,
  ShoppingBag,
  MessageSquare,
  Eye,
  Heart,
  ShoppingCart,
  ArrowUpRight,
  PlusCircle,
  RefreshCw,
} from 'lucide-react';

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [trafficData, setTrafficData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const COLORS = [
    '#c5a059',
    '#15151a',
    '#e6c875',
    '#8b8478',
    '#383b42',
    '#ad8442',
    '#2a4365',
    '#4a1221',
  ];

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      const [sum, traffic, catPerf] = await Promise.all([
        analyticsService.getSummary(),
        analyticsService.getDailyTraffic(),
        analyticsService.getCategoryPerformance(),
      ]);

      setSummary(sum);
      setTrafficData(traffic);
      setCategoryData(catPerf);
    } catch (err) {
      console.error('Error loading dashboard data:', err);

      setError(
        err.message || 'Failed to load dashboard data.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center text-luxury-gold-600">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-gold-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4">
        <div className="bg-white border border-red-200 p-6 text-center shadow-sm">
          <h2 className="font-serif text-xl font-bold text-neutral-900 mb-2">
            Unable to Load Dashboard
          </h2>

          <p className="text-sm text-neutral-500 mb-5">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchDashboardData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-luxury-black text-luxury-cream-100 text-xs font-semibold uppercase tracking-wider hover:bg-luxury-charcoal transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const kpiCards = [
    {
      label: 'Total Products',
      value: summary?.totalProducts ?? 0,
      icon: Package,
      link: '/admin/products',
      color: 'text-luxury-gold-700',
    },
    {
      label: 'Registered Patrons',
      value: summary?.totalCustomers ?? 0,
      icon: Users,
      link: '/admin/users',
      color: 'text-blue-600',
    },
    {
      label: 'Total Orders',
      value: summary?.totalOrders ?? 0,
      icon: ShoppingBag,
      link: '/admin/orders',
      color: 'text-emerald-600',
    },
    {
      label: 'WhatsApp Inquiries',
      value: summary?.whatsappOrderRequests ?? 0,
      icon: MessageSquare,
      link: '/admin/orders',
      color: 'text-teal-600',
    },
    {
      label: 'Product Views',
      value: Number(summary?.productViews || 0).toLocaleString(),
      icon: Eye,
      link: '/admin/analytics',
      color: 'text-amber-600',
    },
    {
      label: 'Wishlist Activity',
      value: summary?.wishlistActivity ?? 0,
      icon: Heart,
      link: '/admin/analytics',
      color: 'text-rose-600',
    },
    {
      label: 'Bag Additions',
      value: summary?.cartActivity ?? 0,
      icon: ShoppingCart,
      link: '/admin/analytics',
      color: 'text-indigo-600',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-luxury-gold-700 font-bold block mb-1">
            Executive Summary
          </span>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Atelier Executive Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products/add"
            className="px-4 py-2 bg-luxury-black hover:bg-luxury-charcoal text-luxury-cream-100 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-luxury-gold-400" />

            <span>Add New Garment</span>
          </Link>

          <Link
            to="/admin/orders"
            className="px-4 py-2 bg-luxury-gold-500 hover:bg-luxury-gold-400 text-luxury-black text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>Review Orders</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;

          return (
            <Link
              key={idx}
              to={kpi.link}
              className="bg-white border border-neutral-200/90 p-4 sm:p-5 shadow-xs hover:border-luxury-gold-500/50 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500">
                  {kpi.label}
                </span>

                <Icon
                  className={`w-4 h-4 ${kpi.color} group-hover:scale-110 transition-transform`}
                />
              </div>

              <div className="flex items-baseline justify-between">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 font-sans">
                  {kpi.value}
                </span>

                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-luxury-gold-600 transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Daily Activity */}
      <div className="bg-white border border-neutral-200/90 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div>
            <h3 className="font-serif text-base font-bold text-neutral-900">
              Daily Store Activity
            </h3>

            <p className="text-[11px] text-neutral-500">
              Product views and WhatsApp inquiries
            </p>
          </div>

          <span className="text-xs text-luxury-gold-700 font-bold">
            Live Synced
          </span>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient
                  id="colorViews"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#c5a059"
                    stopOpacity={0.4}
                  />

                  <stop
                    offset="95%"
                    stopColor="#c5a059"
                    stopOpacity={0}
                  />
                </linearGradient>

                <linearGradient
                  id="colorWhatsApp"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#15151a"
                    stopOpacity={0.2}
                  />

                  <stop
                    offset="95%"
                    stopColor="#15151a"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
              />

              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
              />

              <YAxis
                tick={{ fontSize: 11 }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: '#15151a',
                  color: '#fff',
                  border: '1px solid #c5a059',
                  fontSize: '11px',
                }}
              />

              <Area
                type="monotone"
                dataKey="productViews"
                name="Product Views"
                stroke="#c5a059"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorViews)"
              />

              <Area
                type="monotone"
                dataKey="whatsappClicks"
                name="WhatsApp Inquiries"
                stroke="#15151a"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorWhatsApp)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Revenue Distribution */}
        <div className="lg:col-span-6 bg-white border border-neutral-200/90 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-neutral-100">
            <h3 className="font-serif text-base font-bold text-neutral-900">
              Couture Category Valuation Distribution
            </h3>

            <p className="text-[11px] text-neutral-500">
              Non-cancelled order value by collection
            </p>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            {categoryData.length > 0 &&
            categoryData.some(
              (category) => Number(category.value) > 0
            ) ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    innerRadius={50}
                    paddingAngle={3}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          COLORS[index % COLORS.length]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(val) => formatPrice(val)}
                    contentStyle={{
                      backgroundColor: '#15151a',
                      color: '#fff',
                      border: '1px solid #c5a059',
                      fontSize: '11px',
                    }}
                  />

                  <Legend
                    iconSize={8}
                    wrapperStyle={{
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center px-6">
                <p className="text-sm font-semibold text-neutral-700">
                  No category revenue available
                </p>

                <p className="text-xs text-neutral-500 mt-1">
                  Products need to be assigned to a category
                  before category revenue can be displayed.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Category Views */}
        <div className="lg:col-span-6 bg-white border border-neutral-200/90 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-neutral-100">
            <h3 className="font-serif text-base font-bold text-neutral-900">
              Collection Inquiries & Engagement
            </h3>

            <p className="text-[11px] text-neutral-500">
              Product views by collection
            </p>
          </div>

          <div className="h-72 w-full">
            {categoryData.length > 0 &&
            categoryData.some(
              (category) => Number(category.views) > 0
            ) ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={categoryData}
                  layout="vertical"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                  />

                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                  />

                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: 11 }}
                    width={90}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#15151a',
                      color: '#fff',
                      border: '1px solid #c5a059',
                      fontSize: '11px',
                    }}
                  />

                  <Bar
                    dataKey="views"
                    name="Catalogue Views"
                    fill="#c5a059"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-center px-6">
                <div>
                  <p className="text-sm font-semibold text-neutral-700">
                    No category views available
                  </p>

                  <p className="text-xs text-neutral-500 mt-1">
                    Products need to be assigned to a category
                    before category engagement can be displayed.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
