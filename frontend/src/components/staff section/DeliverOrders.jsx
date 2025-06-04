/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

function DeliverOrder() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState("all");
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
          (order) => order.status === "Delivered"
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
      <div className="p-6 w-[74%] flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading delivered orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-4xl">📦</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            No Delivered Orders
          </h2>
          <p className="text-gray-500">No orders have been delivered yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6  bg-gray-50 ">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Delivered Orders
            </h1>
            <p className="text-gray-600">
              Track and manage successfully delivered orders
            </p>
          </div>
          <div className="bg-green-100 px-6 py-3 rounded-xl">
            <span className="text-green-800 font-semibold text-lg">
              {orders.length} Orders Delivered
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
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
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
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
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
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
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
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-green-200"
            >
              {/* Order Header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-xl">✅</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{order.name}</h3>
                      <p className="text-green-100 text-sm">Order Delivered</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      Rs. {order.totalAmount}
                    </p>
                    <p className="text-green-100 text-sm">Total Amount</p>
                  </div>
                </div>

                <div className="text-green-100 text-sm">
                  <p>Order ID: {order._id.slice(-8).toUpperCase()}</p>
                  <p>
                    Delivered: {new Date(order.createdAt).toLocaleDateString()}
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
                        <p className="text-sm text-gray-500">Address</p>
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

                {/* Items Section */}
                <div className="border-t border-gray-100 pt-6">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span>📦</span>
                    Items Delivered ({order.items.length})
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
                            <span className="text-sm font-medium text-green-600">
                              Rs. {item.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
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

export default DeliverOrder;
