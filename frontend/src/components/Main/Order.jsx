import React, { useEffect, useState } from "react";
import {
  Clock,
  Package,
  CheckCircle,
  XCircle,
  Truck,
  Calendar,
  User,
  Phone,
  MapPin,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";
import Notfound from "../Notfound";

function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("userToken");

  const domain = "http://localhost:8080";
  const userId = localStorage.getItem("userId");

  const statusIcons = {
    Pending: <Clock className="text-yellow-500" />,
    Confirmed: <Package className="text-blue-500" />,
    Dispatch: <Truck className="text-indigo-500" />,
    Delivered: <CheckCircle className="text-green-500" />,
    Cancelled: <XCircle className="text-red-500" />,
  };

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Confirmed: "bg-blue-100 text-blue-800",
    Dispatch: "bg-indigo-100 text-indigo-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  async function getUserOrders() {
    try {
      setLoading(true);
      const response = await fetch(`${domain}/api/userOrders/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (response.ok) {
        setOrders(result);
        console.log("Orders data fetched:", result);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Error in finding user orders:", error);
      setError("Failed to load orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userId) getUserOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!userId) {
    return <Notfound />;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          My Orders
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No orders found
            </h3>
            <p className="mt-2 text-gray-500">
              You haven't placed any orders yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-gray-50">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Order #{order._id?.substring(order._id.length - 8)}
                    </h3>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                      statusColors[order.status]
                    }`}
                  >
                    <span className="mr-1">{statusIcons[order.status]}</span>
                    {order.status}
                  </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        Shipping Details
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <User className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                          <p className="text-sm text-gray-900">{order.name}</p>
                        </div>
                        <div className="flex items-start">
                          <Phone className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                          <p className="text-sm text-gray-900">{order.phone}</p>
                        </div>
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                          <p className="text-sm text-gray-900">
                            {order.address}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        Order Summary
                      </h4>
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">
                            Items (
                            {order.items.reduce(
                              (acc, item) => acc + item.quantity,
                              0
                            )}
                            )
                          </span>
                          <span className="text-sm text-gray-900">
                            ${order.totalAmount}
                          </span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">
                            Shipping
                          </span>
                          <span className="text-sm text-gray-900">
                            ${order.deliveryCharges}
                          </span>
                        </div>
                        <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-medium">
                          <span className="text-gray-900">Total</span>
                          <span className="text-gray-900">
                            ${order.totalAmount + order.deliveryCharges}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200">
                  <div className="px-4 py-5 sm:px-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-4">
                      Order Items
                    </h4>
                    <ul className="divide-y divide-gray-200">
                      {order.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="py-4 flex items-center">
                          <div className="h-16 w-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                            {item.img ? (
                              <img
                                src={item.img}
                                alt={item.productName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <Package className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {item.productName}
                            </p>
                            <div className="mt-1 flex justify-between text-sm text-gray-500">
                              <p>
                                ${item.price.toFixed(2)} × {item.quantity}
                              </p>
                              <p className="font-medium text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Order;
