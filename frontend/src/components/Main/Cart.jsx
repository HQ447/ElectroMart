/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  ShoppingBag,
  Truck,
  Tag,
  CreditCard,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";
import loadingImg from "../../assets/Loading_icon.gif";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Notfound from "../Notfound";
import { setDelCharges } from "../../../store/userSlice";

function Cart() {
  const [cartdata, setCartdata] = useState([]);
  const [delcharges, setDelcharges] = useState("3");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState("0");
  const domain = "http://localhost:8080";
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("userToken");

  // For demo purposes, since we don't have access to useDispatch and useNavigate
  const dispatch = useDispatch();

  const navigate = useNavigate();

  // Api Call for Get Cart Data
  async function getCartdata() {
    setLoading(true);
    try {
      const response = await fetch(`${domain}/api/cartItems/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const responsedata = await response.json();
      if (response.ok) {
        setCartdata(responsedata);
        setLoading(false);
        localStorage.setItem("cartSize", responsedata.length);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function handleIncrement(id) {
    try {
      const response = await fetch(`${domain}/api/increment/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        getCartdata();
        calTotalPrice();
      } else alert(result.message);
    } catch (error) {
      console.error("error in incrementation of product quantity", error);
    }
  }

  async function handleDecrement(id) {
    try {
      const response = await fetch(`${domain}/api/decrement/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        getCartdata();
        calTotalPrice();
      } else alert(result.message);
    } catch (error) {
      console.error("error in decrementation of product quantity", error);
    }
  }

  //Api Call for Delete Cart Data
  async function deleteItem(id) {
    try {
      const response = await fetch(`${domain}/api/removeCartItem/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        getCartdata();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const calTotalPrice = (cartdata) => {
    let price = 0;
    cartdata.map((e) => (price += e.price * e.qty));
    setTotal(price);
  };

  useEffect(() => {
    calTotalPrice(cartdata);
  }, [cartdata]);

  useEffect(() => {
    if (userId) {
      getCartdata();
      dispatch({ type: "SET_DELIVERY_CHARGES", payload: delcharges });
    }
  }, []);

  if (!userId) {
    return <Notfound />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3 w-full">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <img src={loadingImg} alt="loading" className="w-16" />
                </div>
              ) : cartdata.length > 0 ? (
                <div>
                  <div className="hidden md:flex justify-between items-center px-6 py-3 bg-gray-50 border-b">
                    <div className="w-1/2 text-sm font-medium text-gray-500">
                      Product
                    </div>
                    <div className="w-1/6 text-center text-sm font-medium text-gray-500">
                      Quantity
                    </div>
                    <div className="w-1/6 text-center text-sm font-medium text-gray-500">
                      Price
                    </div>
                    <div className="w-1/6 text-right text-sm font-medium text-gray-500">
                      Actions
                    </div>
                  </div>

                  <ul className="divide-y divide-gray-200">
                    {cartdata.map((product, index) => (
                      <li key={index} className="px-4 py-4 sm:px-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          {/* Product Info */}
                          <div className="flex items-center md:w-1/2">
                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <img
                                src={product.img}
                                alt={product.productName}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className="ml-4">
                              <h3 className="text-base font-medium text-gray-900">
                                {product.productName}
                              </h3>
                              <p className="mt-1 text-sm text-gray-500 md:hidden">
                                ${product.price} each
                              </p>
                            </div>
                          </div>

                          {/* Quantity */}
                          <div className="flex items-center justify-between mt-4 md:mt-0 md:w-1/6 md:justify-center">
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button
                                onClick={() => handleDecrement(product._id)}
                                className="p-1 hover:bg-gray-100"
                              >
                                <Minus className="h-5 w-5 text-gray-500" />
                              </button>
                              <span className="mx-2 w-6 text-center font-medium">
                                {product.qty}
                              </span>
                              <button
                                onClick={() => handleIncrement(product._id)}
                                className="p-1 hover:bg-gray-100"
                              >
                                <Plus className="h-5 w-5 text-gray-500" />
                              </button>
                            </div>
                            <span className="md:hidden text-sm font-medium">
                              Quantity
                            </span>
                          </div>

                          {/* Price */}
                          <div className="mt-4 md:mt-0 md:w-1/6 text-right md:text-center">
                            <span className="text-base font-medium text-gray-900">
                              ${(product.price * product.qty).toFixed(2)}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="mt-4 md:mt-0 md:w-1/6 flex justify-end">
                            <button
                              onClick={() => deleteItem(product._id)}
                              className="group p-2 text-gray-500 hover:text-red-600"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="py-12 px-4 text-center">
                  <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    Your cart is empty
                  </h3>
                  <p className="mt-1 text-gray-500">
                    Add items to your cart to see them here.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => navigate("/")}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3 w-full">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b">
                <h2 className="text-lg font-medium text-gray-900">
                  Order Summary
                </h2>
              </div>

              <div className="px-6 py-4 space-y-6">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <ShoppingBag className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-700">
                      Items ({cartdata.length})
                    </span>
                  </div>
                  <span className="font-medium">
                    ${parseFloat(total).toFixed(2)}
                  </span>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <Truck className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-700">Shipping</span>
                  </div>
                  <select
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    onChange={(e) => {
                      const newCharge = e.target.value;
                      setDelcharges(newCharge);
                      dispatch(setDelCharges(newCharge));
                    }}
                    value={delcharges}
                  >
                    <option value="3">Normal Delivery - $3.00</option>
                    <option value="5">Standard Delivery - $5.00</option>
                    <option value="10">Urgent Delivery - $10.00</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <Tag className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-700">Discount Code</span>
                  </div>
                  <div className="flex mt-1">
                    <input
                      type="text"
                      placeholder="Enter your code"
                      className="flex-1 py-2 px-3 border border-gray-300 bg-white rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-r-md hover:bg-gray-300 transition-colors duration-200 text-sm font-medium">
                      Apply
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-900 font-medium">Total</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      {cartdata.length > 0
                        ? `$${(
                            parseFloat(total) + parseFloat(delcharges)
                          ).toFixed(2)}`
                        : "$0.00"}
                    </span>
                  </div>
                </div>

                {cartdata.length > 0 && (
                  <button
                    onClick={() => navigate("/checkout")}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium transition-colors duration-200 flex items-center justify-center"
                  >
                    Proceed to Checkout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
