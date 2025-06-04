/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Truck,
  Package,
  RefreshCw,
  Loader,
  Search,
  Filter,
  ChevronDown,
  CalendarDays,
  DollarSign,
} from "lucide-react";

export default function ManageOrder() {
  const [status, setStatus] = useState("Pending");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Toggle order details expand/collapse
  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  // Calculate order metrics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;
  const DeliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  );

  const totalRevenue = DeliveredOrders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  // Filter orders based on search term and status filter
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchTerm === "" ||
      order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort filtered orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    // Handle date sorting
    if (sortField === "createdAt") {
      valA = new Date(valA).getTime();
      valB = new Date(valB).getTime();
    }

    // Handle number sorting
    if (typeof valA === "number" && typeof valB === "number") {
      return sortDirection === "asc" ? valA - valB : valB - valA;
    }

    // Handle string sorting
    if (typeof valA === "string" && typeof valB === "string") {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
      return sortDirection === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    return 0;
  });

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);

  const handleUpdateStatus = async (orderId) => {
    try {
      console.log("updates status is ", status);
      const res = await fetch(
        `http://localhost:8080/api/updateOrderStatus/${orderId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newStatus: status }),
        }
      );
      const data = await res.json();
      if (data.success) {
        await refreshData();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Sort indicator
  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? "↑" : "↓";
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8  ">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
                Order Management
              </h1>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="relative">
                  <input
                    type="text"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  <Search
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={18}
                  />
                </div>
                <button
                  onClick={refreshData}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <RefreshCw
                    size={18}
                    className={`mr-2 ${refreshing ? "animate-spin" : ""}`}
                  />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Dashboard statistics */}
          <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-lg p-2">
                  <Package className="text-blue-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-800">
                    Total Orders
                  </p>
                  <p className="text-2xl font-semibold text-blue-900">
                    {totalOrders}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <div className="flex items-center">
                <div className="bg-yellow-100 rounded-lg p-2">
                  <Truck className="text-yellow-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-yellow-800">
                    Pending Orders
                  </p>
                  <p className="text-2xl font-semibold text-yellow-900">
                    {pendingOrders}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-lg p-2">
                  <DollarSign className="text-green-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-800">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-semibold text-green-900">
                    {formatCurrency(totalRevenue)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status filter tabs */}
          <div className="px-6 py-2 border-b border-gray-200">
            <div className="flex space-x-1 overflow-x-auto pb-1">
              {[
                "All",
                "Pending",
                "Dispatched",
                "Delivered",
                "Cancelled",
                "Out of Stock",
              ].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusFilter(status)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${
                    statusFilter === status
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="px-6 py-4">
            {loading ? (
              <div className="py-12 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <Loader className="h-8 w-8 text-blue-500 animate-spin mb-2" />
                  <p className="text-gray-500">Loading orders...</p>
                </div>
              </div>
            ) : currentOrders.length > 0 ? (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer Details
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("totalAmount")}
                      >
                        <div className="flex items-center">
                          <span>Amount</span>
                          <span className="ml-1 text-gray-400">
                            <SortIcon field="totalAmount" />
                          </span>
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("status")}
                      >
                        <div className="flex items-center">
                          <span>Status</span>
                          <span className="ml-1 text-gray-400">
                            <SortIcon field="status" />
                          </span>
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("createdAt")}
                      >
                        <div className="flex items-center">
                          <span>Date</span>
                          <span className="ml-1 text-gray-400">
                            <SortIcon field="createdAt" />
                          </span>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentOrders.map((order) => (
                      <React.Fragment key={order._id}>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-xs text-gray-500 truncate max-w-xs">
                                  ID: {order._id}
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                  {order.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {order.phone}
                                </div>
                                <div className="text-xs text-gray-500 truncate max-w-xs">
                                  {order.address}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-gray-900">
                              {formatCurrency(order.totalAmount)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.items.length}{" "}
                              {order.items.length === 1 ? "item" : "items"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs inline-flex items-center rounded-full font-medium ${
                                order.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : order.status === "Delivered"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.status === "Out of Stock"
                                  ? "bg-red-100 text-red-800"
                                  : order.status === "Confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "Cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-500">
                              <CalendarDays size={14} className="mr-1" />
                              {formatDate(order.createdAt)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => toggleOrderDetails(order._id)}
                              className="text-blue-600 hover:text-blue-900 flex items-center justify-end"
                            >
                              {expandedOrder === order._id
                                ? "Hide Details"
                                : "View Details"}
                              <ChevronDown
                                size={16}
                                className={`ml-1 transition-transform duration-200 ${
                                  expandedOrder === order._id
                                    ? "transform rotate-180"
                                    : ""
                                }`}
                              />
                            </button>
                          </td>
                        </tr>
                        {expandedOrder === order._id && (
                          <tr className="bg-gray-50">
                            <td colSpan="5" className="px-6 py-4">
                              <div className="border-t border-gray-200 pt-4">
                                <h4 className="font-medium text-gray-900 mb-2">
                                  Order Items
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {order.items.map((item, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200"
                                    >
                                      <img
                                        src={item.img}
                                        alt={item.productName}
                                        className="w-16 h-16 object-cover rounded"
                                      />
                                      <div>
                                        <p className="font-medium text-gray-900">
                                          {item.productName}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          Qty: {item.quantity}
                                        </p>
                                        <p className="text-sm font-medium text-gray-900">
                                          {formatCurrency(
                                            item.price * item.quantity
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center pt-3 border-t border-gray-200">
                                  <div className="mb-2 sm:mb-0">
                                    <p className="text-sm text-gray-500">
                                      Delivery Charges:{" "}
                                      {formatCurrency(order.deliveryCharges)}
                                    </p>
                                  </div>

                                  {order.status !== "Dispatched" &&
                                  order.status !== "Delivered" ? (
                                    <div className="flex space-x-3">
                                      <select
                                        onChange={(e) =>
                                          setStatus(e.target.value)
                                        }
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                      >
                                        <option value="Pending">
                                          Update Status
                                        </option>

                                        <option value="Out of Stock">
                                          Out of Stock
                                        </option>
                                        <option value="Cancelled">
                                          Cancelled
                                        </option>

                                        <option value="Confirmed">
                                          Confirmed
                                        </option>
                                      </select>
                                      <button
                                        onClick={() =>
                                          handleUpdateStatus(order._id)
                                        }
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                      >
                                        Update Status
                                      </button>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 flex items-center justify-center">
                <div className="text-center">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No orders found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || statusFilter !== "All"
                      ? "No orders match your current filters"
                      : "There are no orders in the system yet"}
                  </p>
                  {(searchTerm || statusFilter !== "All") && (
                    <div className="mt-6">
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setStatusFilter("All");
                        }}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Pagination Footer */}
          {currentOrders.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0 text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">{indexOfFirstOrder + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastOrder, sortedOrders.length)}
                  </span>{" "}
                  of <span className="font-medium">{sortedOrders.length}</span>{" "}
                  orders
                </div>
                <div className="flex justify-center sm:justify-end space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    } border border-gray-300`}
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }).map(
                    (_, idx) => {
                      let pageToShow;
                      if (totalPages <= 5) {
                        pageToShow = idx + 1;
                      } else if (currentPage <= 3) {
                        pageToShow = idx + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageToShow = totalPages - 4 + idx;
                      } else {
                        pageToShow = currentPage - 2 + idx;
                      }

                      return (
                        <button
                          key={pageToShow}
                          onClick={() => setCurrentPage(pageToShow)}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === pageToShow
                              ? "bg-blue-600 text-white"
                              : "bg-white text-gray-700 hover:bg-gray-100"
                          } border border-gray-300`}
                        >
                          {pageToShow}
                        </button>
                      );
                    }
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    } border border-gray-300`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
