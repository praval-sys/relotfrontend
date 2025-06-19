// pages/products.js
"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../page";
import api from "../../../lib/api";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  Eye
} from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const STATUS_COLORS = {
  PENDING: '#F59E0B',
  PROCESSING: '#3B82F6',
  SHIPPED: '#10B981',
  DELIVERED: '#059669',
  CANCELLED: '#EF4444'
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30'); // days
  const [statistics, setStatistics] = useState({
    ordersByStatus: [],
    ordersByDay: [],
    topProducts: []
  });
  const [totalStats, setTotalStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalDiscount: 0,
    averageOrderValue: 0
  });

  // Calculate date range
  const getDateRange = (days) => {
    const end = new Date();
    const start = days === 'month' 
      ? startOfMonth(end)
      : subDays(end, parseInt(days));
    return {
      startDate: start.toISOString(),
      endDate: end.toISOString()
    };
  };

  // Update the fetchStatistics function in your dashboard component
  const fetchStatistics = async (days = dateRange) => {
    try {
      setLoading(true);
      const { startDate, endDate } = getDateRange(days);
      
      // Fetch order statistics
      const statsResponse = await api.get('/v1/admin/orders/statistics/', {
        params: { startDate, endDate }
      });

      if (statsResponse.data.success) {
        const { data } = statsResponse.data;
        
        setStatistics({
          ordersByStatus: data.ordersByStatus,
          ordersByDay: data.ordersByDay,
          topProducts: data.topProducts
        });
        
        // Use the statistics from the API response
        setTotalStats({
          totalOrders: data.totalOrders,
          totalRevenue: data.totalRevenue,
          totalDiscount: data.totalDiscount,
          averageOrderValue: data.averageOrderValue // Now available from API
        });
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [dateRange]);

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = "blue" }) => (
    <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {trendValue}
            </div>
          )}
        </div>
        <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const formatCurrency = (value) => `₹${value.toLocaleString()}`;
  const formatNumber = (value) => value.toLocaleString();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-lg font-medium text-gray-700">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Overview of your store performance and analytics
              </p>
            </div>
            
            {/* Date Range Selector */}
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="month">This month</option>
              </select>
              <button
                onClick={() => fetchStatistics(dateRange)}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Orders"
            value={formatNumber(totalStats.totalOrders)}
            icon={ShoppingCart}
            color="blue"
          />
          <StatCard
            title="Total Revenue"
            value={formatCurrency(totalStats.totalRevenue)}
            icon={DollarSign}
            color="green"
          />
          <StatCard
            title="Total Discounts"
            value={formatCurrency(totalStats.totalDiscount)}
            icon={Package}
            color="orange"
          />
          <StatCard
            title="Avg Order Value"
            value={formatCurrency(totalStats.averageOrderValue)}
            icon={TrendingUp}
            color="purple"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Orders Over Time */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Orders Over Time</h3>
              <div className="flex items-center text-sm text-gray-500">
                <Eye className="h-4 w-4 mr-1" />
                Daily view
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={statistics.ordersByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="_id" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                  formatter={(value, name) => [
                    name === 'count' ? formatNumber(value) : formatCurrency(value),
                    name === 'count' ? 'Orders' : 'Revenue'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Over Time */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Over Time</h3>
              <div className="flex items-center text-sm text-gray-500">
                <DollarSign className="h-4 w-4 mr-1" />
                Daily revenue
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={statistics.ordersByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="_id" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                  formatter={(value) => [formatCurrency(value), 'Revenue']}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Order Status Distribution */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Status Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statistics.ordersByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {statistics.ordersByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry._id] || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatNumber(value), 'Orders']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Status Summary */}
            <div className="mt-4 space-y-2">
              {statistics.ordersByStatus.map((status) => (
                <div key={status._id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: STATUS_COLORS[status._id] || '#gray' }}
                    />
                    <span className="text-sm text-gray-600 capitalize">{status._id.toLowerCase()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">{formatNumber(status.count)}</span>
                    <div className="text-xs text-gray-500">{formatCurrency(status.revenue)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
              <div className="flex items-center text-sm text-gray-500">
                <Package className="h-4 w-4 mr-1" />
                By quantity sold
              </div>
            </div>
            
            {statistics.topProducts.length > 0 ? (
              <div className="space-y-4">
                {statistics.topProducts.map((product, index) => (
                  <div key={product._id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-blue-600 font-semibold text-sm">#{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{product.name}</h4>
                      <p className="text-sm text-gray-500">Product ID: {product._id}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatNumber(product.totalQuantity)} sold
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatCurrency(product.totalRevenue)}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Bar Chart for Top Products */}
                <div className="mt-6">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={statistics.topProducts}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value) => [formatNumber(value), 'Quantity Sold']} />
                      <Bar dataKey="totalQuantity" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No product data available for the selected period</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
              <ShoppingCart className="h-5 w-5 mr-2" />
              View All Orders
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
              <Package className="h-5 w-5 mr-2" />
              Manage Products
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
              <Users className="h-5 w-5 mr-2" />
              Customer Analytics
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
              <Download className="h-5 w-5 mr-2" />
              Export Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
