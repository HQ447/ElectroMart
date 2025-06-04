import React, { useEffect, useState } from "react";
import loadingImg from "../../assets/Loading_icon.gif";

function Products() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pricefilter, setPricefilter] = useState([0, 10000]);
  const [category, setCategory] = useState("all");
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [adminId, setAdminId] = useState(localStorage.getItem("adminId"));
  const [staffId, setStaffId] = useState(localStorage.getItem("staffId"));
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const domain = "http://localhost:8080";
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const interval = setInterval(() => {
      setUserId(localStorage.getItem("userId"));
      setAdminId(localStorage.getItem("adminId"));
      setStaffId(localStorage.getItem("staffId"));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  async function getData() {
    setLoading(true);
    try {
      const response = await fetch(`${domain}/api/products`);
      const responsedata = await response.json();
      if (response.ok) {
        console.log("Fetched data:", responsedata);
        if (responsedata.length > 0) {
          //console.log("First product structure:", responsedata[0]);
        }
        setData(responsedata);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  // Get unique categories from the data
  const uniqueCategories = [
    ...new Set(data.map((item) => item.category).filter(Boolean)),
  ];

  const filteredData = data
    .filter((element) => {
      if (!element || !element.productName) return false;
      const matchesSearch =
        searchQuery === "" ||
        element.productName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice =
        element.price >= pricefilter[0] && element.price <= pricefilter[1];
      const matchesCategory =
        category === "all" ||
        (element.category &&
          element.category.toLowerCase().trim() ===
            category.toLowerCase().trim());
      return matchesSearch && matchesPrice && matchesCategory;
    })
    .sort((a, b) => a.productName.localeCompare(b.productName));

  const toggleFavorite = (productId) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const handleFav = async (element) => {
    console.log("added to fac", element);

    if (adminId) {
      alert("You are admin, not a customer 🙂");
      return;
    }
    if (!userId) {
      alert("Please login first to add to cart.");
      return;
    }

    toggleFavorite(element._id);

    const favItem = {
      userId,
      productId: element._id,
      img: element.img,
      productName: element.productName,
      description: element.description,
      price: element.price,
      qty: element.qty || 1,
    };

    try {
      const response = await fetch(`${domain}/api/addToFav`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(favItem),
      });

      const responseData = await response.json();

      if (response.ok) {
        alert(responseData.message);
      } else {
        alert(`${responseData.message || "Unknown error"}`);
        if (responseData.error) {
          console.error("Server error details:", responseData.error);
        }
      }
    } catch (error) {
      console.error("Network or parsing error:", error);
      alert(
        "Failed to add product in your wish list. Please check the console for details."
      );
    }
  };

  const addtocart = async (element) => {
    if (adminId) {
      alert("You are admin, not a customer 🙂");
      return;
    }
    if (staffId) {
      alert("You are Staff Member, not a customer 🙂");
      return;
    }
    if (!userId && !staffId && !adminId) {
      alert("Please login to add to cart.");
      return;
    }

    const cartItem = {
      userId,
      productId: element._id,
      img: element.img,
      productName: element.productName,
      description: element.description,
      price: element.price,
      qty: element.qty || 1,
    };

    try {
      const response = await fetch(`${domain}/api/addToCart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cartItem),
      });

      const responseData = await response.json();

      if (response.ok) {
        alert(responseData.message);
      } else {
        alert(`${responseData.message || "Unknown error"}`);
        if (responseData.error) {
          console.error("Server error details:", responseData.error);
        }
      }
    } catch (error) {
      console.error("Network or parsing error:", error);
      alert("Failed to add product. Please check the console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 px-6 ">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Premium Collection
          </h1>
          <p className="text-blue-100 text-lg max-w-3xl mx-auto">
            Discover amazing products at unbeatable prices
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            {/* Search */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Products
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 absolute left-3 top-2.5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Category */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={pricefilter[0]}
                  onChange={(e) =>
                    setPricefilter([
                      parseInt(e.target.value) || 0,
                      pricefilter[1],
                    ])
                  }
                  className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={pricefilter[1]}
                  onChange={(e) =>
                    setPricefilter([
                      pricefilter[0],
                      parseInt(e.target.value) || 100000,
                    ])
                  }
                  className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>
            </div>

            {/* Results Count */}
            <div className="md:col-span-1">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-blue-600">
                  {filteredData.length}
                </div>
                <div className="text-sm text-blue-500">Products Found</div>
              </div>
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setPricefilter([0, 500])}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                Under $500
              </button>
              <button
                onClick={() => setPricefilter([500, 1000])}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                $500 - $1000
              </button>
              <button
                onClick={() => setPricefilter([1000, 5000])}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                $1000 - $5000
              </button>
              <button
                onClick={() => setPricefilter([0, 10000])}
                className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-colors"
              >
                All Prices
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <img src={loadingImg} alt="Loading" className="w-20" />
          </div>
        ) : filteredData.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredData.map((element, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="relative">
                  <img
                    src={element.img}
                    alt={element.productName}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <button
                    onClick={() => handleFav(element)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 ${
                        favorites.has(element._id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                  {element.category && (
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-2 py-1 ${
                          element.category == "Laptops"
                            ? "bg-amber-500"
                            : element.category == "Smart Phones"
                            ? "bg-green-500"
                            : element.category == "Watches"
                            ? "bg-indigo-500"
                            : "bg-purple-500"
                        } text-white text-xs font-semibold rounded-full`}
                      >
                        {element.category.toUpperCase()}
                      </span>
                    </div>
                  )}
                  {element.price > 500 && (
                    <div className="absolute top-10 left-3">
                      <span className="px-2 py-1 bg-orange-600 text-white text-xs font-semibold rounded-full">
                        PREMIUM
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                    {element.productName}
                  </h3>
                  <p className="text-xs text-gray-700 mb-1 line-clamp-2 my-1">
                    {element.description}
                  </p>

                  <div className="flex items-center mt-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-3 w-3 ${
                            i < 4
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-xs text-gray-600">(4.2)</span>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1">
                      <span className="text-lg font-bold text-gray-900">
                        ${element.price}
                      </span>
                      {element.price > 1000 && (
                        <span className="text-xs text-gray-500 line-through">
                          ${Math.round(element.price * 1.2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => addtocart(element)}
                    className="w-full shadow-sm shadow-blue-500 py-2 px-3 rounded-lg hover:bg-orange-500 hover:text-white transition-colors duration-300 flex items-center justify-center text-sm font-medium"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mb-4 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No products found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
