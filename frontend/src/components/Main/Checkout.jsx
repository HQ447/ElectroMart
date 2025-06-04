import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Notfound from "../Notfound";
// Make sure you've installed html2pdf.js with: npm install html2pdf.js
//import html2pdf from "html2pdf.js";

function Checkout() {
  const [customerName, setcustomerName] = useState("");
  const [customerPhone, setcustomerPhone] = useState("");
  const [customerAddress, setcustomerAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("1");
  const [cartdata, setCartdata] = useState([]);
  const [total, setTotal] = useState("0");
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");
  const domain = "http://localhost:8080";
  const userId = localStorage.getItem("userId");
  const invoiceRef = useRef(null);
  const date = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  //const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const deliveryCharges = useSelector((state) => state.user.delCharges);

  //   PDF generation function commented out as in original code

  async function getCartdata() {
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
        console.log("response", responsedata);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const calTotalPrice = (cartdata) => {
    let price = 0;
    cartdata.forEach((e) => (price += e.price * e.qty));
    setTotal(price);
    console.log("The total price is ", price);
  };

  const handleOrderSubmission = async () => {
    if (!customerName || !customerPhone || !customerAddress) {
      alert("Please Fill All the required fields");
      return;
    }
    const orderSummary = {
      userId: userId,
      name: customerName,
      phone: customerPhone,
      address: customerAddress,
      deliveryCharges: deliveryCharges,
      totalAmount: total,
    };
    console.log(orderSummary);

    try {
      const response = await fetch(`${domain}/api/placeOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderSummary),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        console.log(result);
        navigate("/product");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error in placing order ", error);
    }
  };

  useEffect(() => {
    if (userId) {
      getCartdata();
    }
  }, []);

  useEffect(() => {
    if (cartdata.length > 0) {
      calTotalPrice(cartdata);
    }
  }, [cartdata]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {!userId || !cartdata.length > 0 ? (
        <Notfound />
      ) : (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 pt-20">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
            Checkout
          </h1>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Customer Information Form */}
            <div className="order-details flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-4 px-6">
                <h2 className="text-xl font-bold text-white">
                  Customer Information
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                    onChange={(e) => setcustomerName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+92-00000000"
                    className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                    onChange={(e) => setcustomerPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="House#92 , Street #00 , City"
                    className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                    onChange={(e) => setcustomerAddress(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Payment Method
                  </label>
                  <select
                    name="payment Method"
                    className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="1">Cash on Delivery</option>
                    <option value="2">Credit/Debit Card</option>
                    <option value="3">Easypaisa</option>
                    <option value="4">Jazzcash</option>
                  </select>
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    Selected:{" "}
                    <span className="font-bold text-indigo-600">
                      {paymentMethod === "1"
                        ? "Cash on Delivery"
                        : paymentMethod === "2"
                        ? "Credit/Debit Card"
                        : paymentMethod === "3"
                        ? "Easypaisa"
                        : "Jazzcash"}
                    </span>
                  </h3>
                </div>

                <div className="pt-2">
                  {paymentMethod === "1" ? (
                    <div className="bg-green-50 p-4 rounded-md">
                      <p className="text-green-700">
                        Pay when your order arrives at your doorstep.
                      </p>
                    </div>
                  ) : paymentMethod === "2" ? (
                    <CardComponents />
                  ) : paymentMethod === "3" ? (
                    <div className="bg-blue-50 p-4 rounded-md">
                      <p className="text-blue-700">
                        Please have your Easypaisa account ready for the
                        transaction.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-red-50 p-4 rounded-md">
                      <p className="text-red-700">
                        Please have your Jazzcash account ready for the
                        transaction.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Invoice */}
            <div className="invoice flex-1">
              <div
                ref={invoiceRef}
                className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
              >
                <div className="flex justify-between items-center bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 px-6">
                  <h2 className="text-xl font-medium">Invoice</h2>
                  <h2 className="text-xl font-bold">TechMart</h2>
                </div>

                <div className="p-6 space-y-4">
                  <div className="header">
                    <h3 className="font-bold text-lg text-gray-800">
                      {customerName || "Customer Name"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {customerPhone || "Phone Number"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {customerAddress || "Delivery Address"}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">{date}</p>
                  </div>

                  <hr className="border-gray-200" />

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            S.No
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Qty
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {cartdata.map((product, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {index + 1}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                              {product.productName}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {product.qty}x{product.price}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              ${(product.price * product.qty).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex flex-col gap-1 items-end pt-2">
                    <div className="flex justify-between w-full max-w-xs">
                      <span className="text-sm text-gray-600">Subtotal:</span>
                      <span className="text-sm font-medium">
                        ${parseFloat(total).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between w-full max-w-xs">
                      <span className="text-sm text-gray-600">
                        Delivery Charges:
                      </span>
                      <span className="text-sm font-medium">
                        ${deliveryCharges}
                      </span>
                    </div>
                    <div className="flex justify-between w-full max-w-xs">
                      <span className="text-sm text-gray-600">Tax (2%):</span>
                      <span className="text-sm font-medium">
                        ${((parseFloat(total) / 100) * 2).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between w-full max-w-xs pt-2 border-t border-gray-200 mt-2">
                      <span className="text-base font-bold text-gray-800">
                        Grand Total:
                      </span>
                      <span className="text-base font-bold text-indigo-600">
                        $
                        {(
                          parseFloat(total) +
                          Number(deliveryCharges) +
                          (parseFloat(total) / 100) * 2
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 border-t border-gray-200">
                  <div className="footer">
                    <h3 className="font-bold text-base text-red-700">
                      TechMart.pk
                    </h3>
                    <p className="text-xs text-gray-500">
                      All rights reserved © 2025
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Actions */}
              {cartdata.length > 0 && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleOrderSubmission}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-700 text-white font-medium rounded-md shadow-md hover:from-indigo-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:-translate-y-1"
                  >
                    Place Order
                  </button>

                  {/* Commented out Download Invoice button as in the original code */}
                  {/* <button
                    className="ml-4 w-1/2 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium rounded-md shadow-md hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform transition-all duration-200 hover:-translate-y-1"
                    onClick={generatePDF}
                    disabled={isGeneratingPDF}
                  >
                    {isGeneratingPDF ? "Generating..." : "Download Invoice"}
                  </button> */}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CardComponents() {
  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4">
      <h3 className="text-lg font-medium text-gray-800 mb-4">
        Enter Your Card Details
      </h3>

      <div className="flex space-x-3 mb-2">
        <div className="p-2 bg-white rounded shadow-sm border border-gray-200 hover:shadow-md transition duration-150 cursor-pointer">
          <img
            src="/api/placeholder/100/60"
            alt="Visa"
            className="h-8 w-auto object-contain"
          />
        </div>
        <div className="p-2 bg-white rounded shadow-sm border border-gray-200 hover:shadow-md transition duration-150 cursor-pointer">
          <img
            src="/api/placeholder/100/60"
            alt="Mastercard"
            className="h-8 w-auto object-contain"
          />
        </div>
        <div className="p-2 bg-white rounded shadow-sm border border-gray-200 hover:shadow-md transition duration-150 cursor-pointer">
          <img
            src="/api/placeholder/100/60"
            alt="American Express"
            className="h-8 w-auto object-contain"
          />
        </div>
        <div className="p-2 bg-white rounded shadow-sm border border-gray-200 hover:shadow-md transition duration-150 cursor-pointer">
          <img
            src="/api/placeholder/100/60"
            alt="Discover"
            className="h-8 w-auto object-contain"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cardholder Name
          </label>
          <input
            type="text"
            required
            placeholder="John Doe"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Number
          </label>
          <input
            type="text"
            required
            placeholder="1234 5678 9012 3456"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              type="date"
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVV
            </label>
            <input
              type="number"
              required
              placeholder="123"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
