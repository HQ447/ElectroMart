/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

function DispatchOrder() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState("all");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const token = localStorage.getItem("staffToken");

  const fetchOrders = async () => {
    fetch("http://localhost:8080/api/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const confirmedOrders = data.orders?.filter(
          (order) => order.status === "Dispatched"
        );
        setOrders(confirmedOrders || []);
        setFilteredOrders(confirmedOrders || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch orders", err);
        setLoading(false);
      });
  };

  const handleUpdateStatus = async (orderId) => {
    if (!status) {
      alert("Please select a status to update");
      return;
    }
    setUpdatingOrderId(orderId);
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
        fetchOrders();
        setStatus("");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Search functionality
  useEffect(() => {
    if (!searchTerm) {
      setFilteredOrders(orders);
      return;
    }

    const filtered = orders.filter((order) => {
      const searchLower = searchTerm.toLowerCase();

      switch (searchFilter) {
        case "name":
          return order.name.toLowerCase().includes(searchLower);
        case "phone":
          return order.phone.includes(searchTerm);
        case "orderId":
          return order._id.toLowerCase().includes(searchLower);
        case "address":
          return order.address.toLowerCase().includes(searchLower);
        default:
          return (
            order.name.toLowerCase().includes(searchLower) ||
            order.phone.includes(searchTerm) ||
            order._id.toLowerCase().includes(searchLower) ||
            order.address.toLowerCase().includes(searchLower)
          );
      }
    });

    setFilteredOrders(filtered);
  }, [searchTerm, searchFilter, orders]);

  if (loading) {
    return (
      <div className="p-6  flex items-center justify-center ">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dispatched orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-4xl">🚚</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            No Dispatched Orders
          </h2>
          <p className="text-gray-500">
            No orders have been dispatched yet and ready for delivery.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6  bg-gray-50 w-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Orders Ready to Deliver
            </h1>
            <p className="text-gray-600">
              Manage dispatched orders and update delivery status
            </p>
          </div>
          <div className="bg-orange-100 px-6 py-3 rounded-xl">
            <span className="text-orange-800 font-semibold text-lg">
              {orders.length} Orders Ready
            </span>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <span className="text-gray-400 text-xl">🔍</span>
                </div>
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700"
              >
                <option value="all">All Fields</option>
                <option value="name">Customer Name</option>
                <option value="phone">Phone Number</option>
                <option value="orderId">Order ID</option>
                <option value="address">Address</option>
              </select>
            </div>
          </div>

          {searchTerm && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Showing {filteredOrders.length} of {orders.length} orders
              </span>
              {filteredOrders.length !== orders.length && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 && searchTerm ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-4xl">🔍</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            No Results Found
          </h2>
          <p className="text-gray-500">
            Try adjusting your search terms or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-orange-200"
            >
              {/* Order Header */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-xl">🚚</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{order.name}</h3>
                      <p className="text-orange-100 text-sm">
                        Ready for Delivery
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      Rs. {order.totalAmount}
                    </p>
                    <p className="text-orange-100 text-sm">Total Amount</p>
                  </div>
                </div>

                <div className="text-orange-100 text-sm">
                  <p>Order ID: {order._id.slice(-8).toUpperCase()}</p>
                  <p>
                    Dispatched: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Order Details */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">📞</span>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium text-gray-800">
                          {order.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-gray-400 mt-1">📍</span>
                      <div>
                        <p className="text-sm text-gray-500">
                          Delivery Address
                        </p>
                        <p className="font-medium text-gray-800 leading-relaxed">
                          {order.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">🚚</span>
                      <div>
                        <p className="text-sm text-gray-500">
                          Delivery Charges
                        </p>
                        <p className="font-medium text-gray-800">
                          Rs. {order.deliveryCharges}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">⏰</span>
                      <div>
                        <p className="text-sm text-gray-500">Ordered At</p>
                        <p className="font-medium text-gray-800">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mb-6">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-orange-100 text-orange-800">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    {order.status}
                  </span>
                </div>

                {/* Items Section */}
                <div className="border-t border-gray-100 pt-6 mb-6">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span>📦</span>
                    Items to Deliver ({order.items.length})
                  </h4>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
                      >
                        <img
                          src={item.img}
                          alt={item.productName}
                          className="w-16 h-16 rounded-lg object-cover shadow-sm"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {item.productName}
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded-md">
                              Qty: {item.quantity}
                            </span>
                            <span className="text-sm font-medium text-orange-600">
                              Rs. {item.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Section */}
                <div className="border-t border-gray-100 pt-6">
                  <h4 className="font-semibold text-gray-800 mb-4">
                    Update Delivery Status
                  </h4>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <select
                        name="status"
                        id="status"
                        value={status}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700"
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="">Select New Status</option>
                        <option value="Delivered">Mark as Delivered</option>
                      </select>
                    </div>
                    <button
                      onClick={() => handleUpdateStatus(order._id)}
                      disabled={!status || updatingOrderId === order._id}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        !status || updatingOrderId === order._id
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                      }`}
                    >
                      {updatingOrderId === order._id ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Updating...
                        </div>
                      ) : (
                        "Update Status"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DispatchOrder;
