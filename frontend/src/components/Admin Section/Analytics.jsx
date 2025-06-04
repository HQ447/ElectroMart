/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaShoppingCart,
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Analytics() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("weekly");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("adminToken");

  const [statsData, setStatsData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    salesGrowth: 0,
  });

  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [topProductsData, setTopProductsData] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchOrders();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (orders.length && products.length && users.length) {
      const totalOrder = orders.length;
      const totalUsers = users.length;

      const deliveredOrders = orders.filter(
        (order) => order.status === "Delivered"
      );
      const totalRevenue = deliveredOrders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
      );

      const countByCategory = (category) =>
        products.filter((p) => p.category === category).length;

      const categoryCounts = {
        "Smart Phones": countByCategory("Smart Phones"),
        Laptops: countByCategory("Laptops"),
        Electronics: countByCategory("Electronics"),
        Watches: countByCategory("Watches"),
        Others: countByCategory("Gagets"),
      };

      const totalProductCount = products.length || 1; // avoid division by zero

      const newCategoryData = Object.entries(categoryCounts).map(
        ([name, count]) => ({
          name,
          value: ((count / totalProductCount) * 100).toFixed(2),
        })
      );

      setStatsData({
        totalRevenue,
        totalOrders: totalOrder,
        totalUsers,
        salesGrowth: 12.3,
      });

      setCategoryData(newCategoryData);

      setTopProductsData([
        { name: "Wireless Earbuds", sales: 452, revenue: 24850 },
        { name: "Smart Watch", sales: 378, revenue: 22680 },
        { name: "Laptop Bag", sales: 325, revenue: 16250 },
        { name: "Bluetooth Speaker", sales: 289, revenue: 14450 },
        { name: "Phone Case", sales: 267, revenue: 5340 },
      ]);
    }
  }, [orders, products, users]);

  useEffect(() => {
    const newSalesData = generateSalesData(period);
    setSalesData(newSalesData);
  }, [period]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUsers(res.ok ? data.users : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/products");
      const data = await res.json();
      setProducts(res.ok ? data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const generateSalesData = (periodType) => {
    const salesDataMap = {
      weekly: [
        { name: "Mon", sales: 4000, orders: 240 },
        { name: "Tue", sales: 3000, orders: 198 },
        { name: "Wed", sales: 5000, orders: 306 },
        { name: "Thu", sales: 2780, orders: 189 },
        { name: "Fri", sales: 1890, orders: 148 },
        { name: "Sat", sales: 2390, orders: 178 },
        { name: "Sun", sales: 3490, orders: 221 },
      ],
      monthly: [
        { name: "Jan", sales: 12400, orders: 745 },
        { name: "Feb", sales: 10398, orders: 623 },
        { name: "Mar", sales: 19000, orders: 982 },
        { name: "Apr", sales: 8780, orders: 543 },
        { name: "May", sales: 9890, orders: 602 },
        { name: "Jun", sales: 11390, orders: 689 },
        { name: "Jul", sales: 14490, orders: 821 },
        { name: "Aug", sales: 10990, orders: 642 },
        { name: "Sep", sales: 9490, orders: 574 },
        { name: "Oct", sales: 15490, orders: 901 },
        { name: "Nov", sales: 17500, orders: 987 },
        { name: "Dec", sales: 21500, orders: 1123 },
      ],
      yearly: [
        { name: "2020", sales: 125000, orders: 7845 },
        { name: "2021", sales: 168000, orders: 9254 },
        { name: "2022", sales: 194000, orders: 10876 },
        { name: "2023", sales: 235000, orders: 12453 },
        { name: "2024", sales: 267000, orders: 14328 },
      ],
    };

    return salesDataMap[periodType] || [];
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  const StatCard = ({ title, value, icon, change }) => (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h4 className="text-2xl font-bold mt-1">{value}</h4>
          {change !== undefined && (
            <div
              className={`flex items-center text-sm mt-2 ${
                change >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {change >= 0 ? (
                <FaArrowUp className="mr-1" />
              ) : (
                <FaArrowDown className="mr-1" />
              )}
              <span>{Math.abs(change)}% from last period</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
          {icon}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Analytics Dashboard
        </h1>
        <select
          className="bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`$${statsData.totalRevenue.toLocaleString()}`}
          icon={<FaMoneyBillWave size={24} />}
          change={statsData.salesGrowth}
        />
        <StatCard
          title="Total Orders"
          value={statsData.totalOrders.toLocaleString()}
          icon={<FaShoppingCart size={24} />}
          change={8.4}
        />
        <StatCard
          title="Total Users"
          value={statsData.totalUsers.toLocaleString()}
          icon={<FaUsers size={24} />}
          change={5.7}
        />
        <StatCard
          title="Avg. Order Value"
          value={`$${Math.round(
            statsData.totalRevenue / (statsData.totalOrders || 1)
          ).toLocaleString()}`}
          icon={<FaShoppingCart size={24} />}
          change={2.1}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Sales Overview
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#4f46e5"
                name="Sales ($)"
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#10b981"
                name="Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Category Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Top Products
          </h2>
          <ul className="space-y-2">
            {topProductsData.map((item, idx) => (
              <li key={idx} className="flex justify-between border-b py-2">
                <span>{item.name}</span>
                <span>${item.revenue.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
