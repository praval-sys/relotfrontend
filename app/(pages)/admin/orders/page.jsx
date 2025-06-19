// pages/products.js
"use client";
import { useEffect, useState } from "react";
import api from "../../../lib/api";
import {
  Search,
  Package,
  Filter,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Truck,
  X,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingBag,
  Trash2
} from "lucide-react";

const DELIVERY_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

const STATUS_COLORS = {
  PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
  PROCESSING: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Package },
  SHIPPED: { bg: 'bg-purple-100', text: 'text-purple-800', icon: Truck },
  DELIVERED: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
  CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', icon: X },
  COMPLETED: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
  FAILED: { bg: 'bg-red-100', text: 'text-red-800', icon: X },
  REFUNDED: { bg: 'bg-gray-100', text: 'text-gray-800', icon: RefreshCw }
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchOrderId, setSearchOrderId] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({
    deliveryStatus: '',
    paymentStatus: '',
    startDate: '',
    endDate: ''
  });
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);
  
  const limit = 10;

  // Fetch all orders with filters and pagination
  const fetchOrders = async (page = 1, filterParams = filters) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        ...filterParams
      };
      
      // Remove empty filter values
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      
      const response = await api.get("/v1/admin/orders", { params });
      
      if (response.data.success) {
        setOrders(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.totalItems);
        setCurrentPage(response.data.pagination.currentPage);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Search specific order by ID
  const searchOrderById = async (orderId) => {
    if (!orderId.trim()) {
      fetchOrders();
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/v1/admin/orders/${orderId}`);
      
      if (response.data.success) {
        setOrders([response.data.data]);
        setTotalPages(1);
        setTotalItems(1);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error searching order:", error);
      if (error.response?.status === 404) {
        setOrders([]);
        setTotalPages(0);
        setTotalItems(0);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle status change with immediate confirmation
  const handleStatusChange = (order, statusType, newStatus) => {
    // Prevent update if same status
    if (order[statusType] === newStatus) {
      return;
    }

    setConfirmDialog({
      type: 'update',
      title: `Update ${statusType === 'paymentStatus' ? 'Payment' : 'Delivery'} Status`,
      message: `Change ${statusType === 'paymentStatus' ? 'payment' : 'delivery'} status from "${order[statusType]}" to "${newStatus}"?`,
      onConfirm: () => updateOrderStatus(order._id, statusType, newStatus),
      order,
      newStatus,
      statusType
    });
  };

  // Update order status
  const updateOrderStatus = async (orderId, statusType, newStatus) => {
    try {
      setUpdatingStatus(orderId);
      
      console.log('Updating order:', orderId, statusType, newStatus); // Debug log
      
      const updateData = {};
      updateData[statusType] = newStatus;
      
      const response = await api.patch(`/v1/admin/orders/${orderId}/status`, updateData);
      
      if (response.data.success) {
        // Update the local state
        setOrders(orders.map(order => 
          order._id === orderId 
            ? { ...order, [statusType]: newStatus }
            : order
        ));
        setConfirmDialog(null);
        console.log('Status updated successfully'); // Debug log
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Delete order
  const deleteOrder = async (orderId) => {
    try {
      const response = await api.delete(`/v1/admin/orders/${orderId}`);
      
      if (response.data.success) {
        // Remove from local state
        setOrders(orders.filter(order => order._id !== orderId));
        setConfirmDialog(null);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    searchOrderById(searchOrderId);
  };

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    setCurrentPage(1);
    fetchOrders(1, newFilters);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchOrders(page, filters);
  };

  // Get status component
  const getStatusBadge = (status, type) => {
    const upperStatus = status.toUpperCase();
    const config = STATUS_COLORS[upperStatus] || STATUS_COLORS.PENDING;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.toLowerCase()}
      </span>
    );
  };

  // Render pagination
  const renderPagination = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pages.map((page, index) => (
      page === "..." ? (
        <span key={index} className="px-3 py-2 text-gray-500">...</span>
      ) : (
        <button
          key={index}
          onClick={() => handlePageChange(page)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            page === currentPage
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      )
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-sm text-gray-600">Manage customer orders and track deliveries</p>
        </div>
        <button
          onClick={() => fetchOrders()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Order ID Search */}
          <form onSubmit={handleSearch} className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by Order ID..."
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </form>

          {/* Delivery Status Filter */}
          <select
            value={filters.deliveryStatus}
            onChange={(e) => handleFilterChange('deliveryStatus', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Delivery Status</option>
            {Object.values(DELIVERY_STATUS).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          {/* Payment Status Filter */}
          <select
            value={filters.paymentStatus}
            onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Payment Status</option>
            {Object.values(PAYMENT_STATUS).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Orders ({totalItems})
            </h2>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No orders found</p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delivery Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      {/* Order Info */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            #{order._id.slice(-8)}
                          </div>
                          <div className="text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          <div className="font-semibold text-green-600">
                            ₹{order.totalAmount}
                          </div>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {order.shippingAddress?.name || 'N/A'}
                          </div>
                          <div className="text-gray-500 flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {order.shippingAddress?.phone || 'N/A'}
                          </div>
                          <div className="text-gray-500 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {order.shippingAddress?.city || 'N/A'}, {order.shippingAddress?.state || 'N/A'}
                          </div>
                        </div>
                      </td>

                      {/* Items */}
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          {order.items?.slice(0, 2).map((item, index) => (
                            <div key={item._id} className="flex items-center mb-2">
                              <img
                                src={item.image || '/placeholder.png'}
                                alt={item.name}
                                className="h-8 w-8 rounded object-cover mr-3"
                              />
                              <div className="text-xs">
                                <div className="font-medium text-gray-900 truncate">
                                  {item.name}
                                </div>
                                <div className="text-gray-500">
                                  {item.quantity} x ₹{item.finalPrice}
                                  {item.color && ` - ${item.color}`}
                                  {item.size && ` (${item.size})`}
                                </div>
                              </div>
                            </div>
                          ))}
                          {order.items?.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{order.items.length - 2} more items
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Payment Status with Dropdown - FIXED */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.paymentStatus}
                          onChange={(e) => {
                            e.preventDefault();
                            handleStatusChange(order, 'paymentStatus', e.target.value);
                          }}
                          disabled={updatingStatus === order._id}
                          className="text-xs font-medium border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 cursor-pointer"
                        >
                          {Object.values(PAYMENT_STATUS).map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>

                      {/* Delivery Status with Dropdown - FIXED */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.deliveryStatus}
                          onChange={(e) => {
                            e.preventDefault();
                            handleStatusChange(order, 'deliveryStatus', e.target.value);
                          }}
                          disabled={updatingStatus === order._id}
                          className="text-xs font-medium border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 cursor-pointer"
                        >
                          {Object.values(DELIVERY_STATUS).map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setViewModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setConfirmDialog({
                                type: 'delete',
                                title: 'Delete Order',
                                message: `Are you sure you want to delete order #${order._id.slice(-8)}? This action cannot be undone.`,
                                onConfirm: () => deleteOrder(order._id),
                                order
                              });
                            }}
                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                            title="Delete order"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalItems)} of {totalItems} orders
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      {renderPagination()}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Confirmation Dialog with Blurred Background */}
      {confirmDialog && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-200">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                  confirmDialog.type === 'delete' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  {confirmDialog.type === 'delete' ? (
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  ) : (
                    <Package className="h-6 w-6 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{confirmDialog.title}</h3>
                  <p className="text-sm text-gray-500">Please confirm your action</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-700 mb-6">
                {confirmDialog.message}
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setConfirmDialog(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    confirmDialog.onConfirm();
                  }}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                    confirmDialog.type === 'delete' 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  disabled={updatingStatus !== null}
                >
                  {updatingStatus !== null ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    confirmDialog.type === 'delete' ? 'Delete' : 'Update'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal with Blurred Background */}
      {viewModalOpen && selectedOrder && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Order Details - #{selectedOrder._id.slice(-8)}
                </h3>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order Information */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Order Information</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-medium">#{selectedOrder._id.slice(-8)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span>{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-semibold text-green-600">₹{selectedOrder.totalAmount?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="capitalize">{selectedOrder.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Status:</span>
                        {getStatusBadge(selectedOrder.paymentStatus, 'payment')}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Status:</span>
                        {getStatusBadge(selectedOrder.deliveryStatus, 'delivery')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-1">
                        <div className="font-medium">{selectedOrder.shippingAddress?.name}</div>
                        <div className="text-gray-600">{selectedOrder.shippingAddress?.street}</div>
                        <div className="text-gray-600">
                          {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.zipCode}
                        </div>
                        <div className="text-gray-600 flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {selectedOrder.shippingAddress?.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-4">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item) => (
                    <div key={item._id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <img
                        src={item.image || '/placeholder.png'}
                        alt={item.name}
                        className="h-16 w-16 rounded-lg object-cover mr-4"
                      />
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{item.name}</h5>
                        <div className="text-sm text-gray-600 space-y-1">
                          {item.color && <div>Color: {item.color}</div>}
                          {item.size && <div>Size: {item.size}</div>}
                          {item.sku && <div>SKU: {item.sku}</div>}
                          <div>Quantity: {item.quantity}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₹{item.finalPrice?.toFixed(2)}</div>
                        {item.discount > 0 && (
                          <div className="text-sm text-gray-500">
                            <span className="line-through">₹{item.price?.toFixed(2)}</span>
                            <span className="text-green-600 ml-1">({item.discount}% off)</span>
                          </div>
                        )}
                        <div className="text-sm text-gray-600">
                          Total: ₹{((item.finalPrice || item.price) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
