"use client";
import { useEffect, useState } from "react";
import api from "../../../lib/api";
import toast from 'react-hot-toast';
import {
  Search,
  Users,
  Filter,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Download,
  UserPlus,
  Globe,
  BarChart3,
  TrendingUp,
  Home,
  X
} from "lucide-react";
import {
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
  LineChart,
  Line
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const ROLE_COLORS = {
  admin: { bg: 'bg-purple-100', text: 'text-purple-800', icon: Shield },
  user: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Users }
};

const PROVIDER_COLORS = {
  email: { bg: 'bg-gray-100', text: 'text-gray-800', icon: Mail },
  google: { bg: 'bg-red-100', text: 'text-red-800', icon: Globe },
  github: { bg: 'bg-gray-900', text: 'text-white', icon: Globe }
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({
    role: '',
    verified: '',
    provider: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const [updatingUser, setUpdatingUser] = useState(null);
  
  const limit = 10;

  // Fetch users with filters and pagination
  const fetchUsers = async (page = 1, search = "", filterParams = filters) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        ...(search && { search }),
        ...filterParams
      };
      
      // Remove empty values
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      
      const response = await api.get("/v1/admin/users", { params });
      
      if (response.data.success) {
        setUsers(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.totalItems);
        setCurrentPage(response.data.pagination.currentPage);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user statistics
  const fetchStatistics = async () => {
    try {
      setStatsLoading(true);
      const [statsResponse, geoResponse] = await Promise.all([
        api.get("/v1/admin/users/statistics"),
        api.get("/v1/admin/users/geographic-distribution")
      ]);
      
      if (statsResponse.data.success) {
        setStatistics(statsResponse.data.data);
      }
      
      if (geoResponse.data.success) {
        setGeoData(geoResponse.data.data);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
      toast.error("Failed to fetch statistics");
    } finally {
      setStatsLoading(false);
    }
  };

  // Search users
  const searchUsers = async (query) => {
    if (!query.trim()) {
      fetchUsers();
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/v1/admin/users/search?q=${encodeURIComponent(query)}`);
      
      if (response.data.success) {
        setUsers(response.data.data);
        setTotalPages(1);
        setTotalItems(response.data.count);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error searching users:", error);
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  // Update user
  const updateUser = async (userId, updateData) => {
    try {
      setUpdatingUser(userId);
      const response = await api.put(`/v1/admin/users/${userId}`, updateData);
      
      if (response.data.success) {
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, ...response.data.data }
            : user
        ));
        setConfirmDialog(null);
        toast.success("User updated successfully");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    } finally {
      setUpdatingUser(null);
    }
  };

  // Toggle user verification
  const toggleVerification = async (userId) => {
    try {
      setUpdatingUser(userId);
      const response = await api.patch(`/v1/admin/users/${userId}/toggle-verification`);
      
      if (response.data.success) {
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, verified: response.data.data.verified }
            : user
        ));
        setConfirmDialog(null);
        toast.success(`User ${response.data.data.verified ? 'verified' : 'unverified'} successfully`);
      }
    } catch (error) {
      console.error("Error toggling verification:", error);
      toast.error("Failed to update verification status");
    } finally {
      setUpdatingUser(null);
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    try {
      const response = await api.delete(`/v1/admin/users/${userId}`);
      
      if (response.data.success) {
        setUsers(users.filter(user => user.id !== userId));
        setConfirmDialog(null);
        toast.success("User deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  // Get user details
  const getUserDetails = async (userId) => {
    try {
      const response = await api.get(`/v1/admin/users/${userId}`);
      
      if (response.data.success) {
        setSelectedUser(response.data.data);
        setViewModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to fetch user details");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStatistics();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchUsers(searchTerm);
    } else {
      fetchUsers();
    }
  };

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    setCurrentPage(1);
    fetchUsers(1, searchTerm, newFilters);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchUsers(page, searchTerm, filters);
  };

  // Get role badge
  const getRoleBadge = (role) => {
    const config = ROLE_COLORS[role] || ROLE_COLORS.user;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {role}
      </span>
    );
  };

  // Get provider badge
  const getProviderBadge = (provider) => {
    const config = PROVIDER_COLORS[provider] || PROVIDER_COLORS.email;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {provider}
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
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-600">Manage users and view analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchUsers()}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Users ({totalItems})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Analytics
            </button>
          </nav>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="p-6">
            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search users by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Search
                </button>
              </form>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  value={filters.role}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Roles</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>

                <select
                  value={filters.verified}
                  onChange={(e) => handleFilterChange('verified', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Verification Status</option>
                  <option value="true">Verified</option>
                  <option value="false">Unverified</option>
                </select>

                <select
                  value={filters.provider}
                  onChange={(e) => handleFilterChange('provider', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Providers</option>
                  <option value="email">Email</option>
                  <option value="google">Google</option>
                  <option value="github">GitHub</option>
                </select>

                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    handleFilterChange('sortBy', sortBy);
                    handleFilterChange('sortOrder', sortOrder);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="email-asc">Email A-Z</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No users found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Provider
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Addresses
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          {/* User Info */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                                  {user.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name || 'No Name'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Joined {new Date(user.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Contact */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              <div className="text-gray-900 flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {user.email}
                              </div>
                              {user.phoneNumber && (
                                <div className="text-gray-500 flex items-center mt-1">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {user.phoneNumber}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Role */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getRoleBadge(user.role)}
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.verified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.verified ? (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              ) : (
                                <Clock className="w-3 h-3 mr-1" />
                              )}
                              {user.verified ? 'Verified' : 'Unverified'}
                            </span>
                          </td>

                          {/* Provider */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getProviderBadge(user.provider)}
                          </td>

                          {/* Addresses */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <Home className="h-3 w-3 mr-1" />
                              {user.addressCount} addresses
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => getUserDetails(user.id)}
                                className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                                title="View details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              
                              <button
                                onClick={() => {
                                  setConfirmDialog({
                                    type: 'verify',
                                    title: `${user.verified ? 'Unverify' : 'Verify'} User`,
                                    message: `Are you sure you want to ${user.verified ? 'unverify' : 'verify'} ${user.name || user.email}?`,
                                    onConfirm: () => toggleVerification(user.id),
                                    user
                                  });
                                }}
                                className={`p-1 rounded transition-colors ${
                                  user.verified 
                                    ? 'text-red-600 hover:text-red-900 hover:bg-red-50' 
                                    : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                                }`}
                                title={user.verified ? 'Unverify user' : 'Verify user'}
                                disabled={updatingUser === user.id}
                              >
                                {user.verified ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                              </button>

                              {user.role !== 'admin' && (
                                <button
                                  onClick={() => {
                                    setConfirmDialog({
                                      type: 'delete',
                                      title: 'Delete User',
                                      message: `Are you sure you want to delete ${user.name || user.email}? This action cannot be undone.`,
                                      onConfirm: () => deleteUser(user.id),
                                      user
                                    });
                                  }}
                                  className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                                  title="Delete user"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm text-gray-700">
                      Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalItems)} of {totalItems} users
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
                )}
              </>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="p-6">
            {statsLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading analytics...</p>
              </div>
            ) : statistics ? (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100">Total Users</p>
                        <p className="text-3xl font-bold">{statistics.totalUsers}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100">Recent Registrations</p>
                        <p className="text-3xl font-bold">{statistics.recentRegistrations}</p>
                        <p className="text-green-100 text-sm">Last 7 days</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100">Avg Addresses</p>
                        <p className="text-3xl font-bold">{statistics.avgAddressesPerUser}</p>
                        <p className="text-purple-100 text-sm">Per user</p>
                      </div>
                      <MapPin className="h-8 w-8 text-purple-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100">Verified Users</p>
                        <p className="text-3xl font-bold">
                          {statistics.usersByVerification.find(v => v.verified)?.count || 0}
                        </p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-orange-200" />
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Users by Role */}
                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Users by Role</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={statistics.usersByRole}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ role, count }) => `${role}: ${count}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {statistics.usersByRole.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Users by Provider */}
                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Users by Provider</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={statistics.usersByProvider}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="provider" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Geographic Distribution */}
                {geoData && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top States */}
                    <div className="bg-white rounded-lg border p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top States</h3>
                      <div className="space-y-3">
                        {geoData.usersByState.slice(0, 10).map((item, index) => (
                          <div key={item.state} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`w-4 h-4 rounded mr-3`} style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                              <span className="text-sm font-medium text-gray-900">{item.state}</span>
                            </div>
                            <span className="text-sm text-gray-600">{item.userCount} users</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top Cities */}
                    <div className="bg-white rounded-lg border p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Cities</h3>
                      <div className="space-y-3">
                        {geoData.usersByCity.slice(0, 10).map((item, index) => (
                          <div key={`${item.city}-${item.state}`} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`w-4 h-4 rounded mr-3`} style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                              <span className="text-sm font-medium text-gray-900">{item.city}, {item.state}</span>
                            </div>
                            <span className="text-sm text-gray-600">{item.userCount} users</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* New Users Over Time */}
                {statistics.newUsersOverTime && statistics.newUsersOverTime.length > 0 && (
                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">New Users Over Time (Last 30 Days)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={statistics.newUsersOverTime}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No analytics data available</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
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
                  ) : confirmDialog.type === 'verify' ? (
                    <UserCheck className="h-6 w-6 text-blue-600" />
                  ) : (
                    <Users className="h-6 w-6 text-blue-600" />
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
                  disabled={updatingUser !== null}
                >
                  {updatingUser !== null ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    confirmDialog.type === 'delete' ? 'Delete' : 'Confirm'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {viewModalOpen && selectedUser && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">User Details</h3>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                {/* User Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">User Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Name</label>
                      <p className="font-medium text-gray-900">{selectedUser.name || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Email</label>
                      <p className="font-medium text-gray-900">{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Phone</label>
                      <p className="font-medium text-gray-900">{selectedUser.phoneNumber || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Role</label>
                      <div className="mt-1">{getRoleBadge(selectedUser.role)}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Status</label>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedUser.verified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedUser.verified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Provider</label>
                      <div className="mt-1">{getProviderBadge(selectedUser.provider)}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Joined</label>
                      <p className="font-medium text-gray-900">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Last Updated</label>
                      <p className="font-medium text-gray-900">{new Date(selectedUser.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Addresses */}
                {selectedUser.addresses && selectedUser.addresses.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Addresses ({selectedUser.addresses.length})</h4>
                    <div className="space-y-3">
                      {selectedUser.addresses.map((address, index) => (
                        <div key={address.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{address.name}</p>
                              <p className="text-sm text-gray-600">{address.street}</p>
                              <p className="text-sm text-gray-600">
                                {address.city}, {address.state} - {address.zipCode}
                              </p>
                              {address.phone && (
                                <p className="text-sm text-gray-600 flex items-center mt-1">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {address.phone}
                                </p>
                              )}
                            </div>
                            {address.isDefault && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Default
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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