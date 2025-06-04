import Notfound from "../Notfound";
import { useState, useEffect } from "react";
import { IoTrashBin } from "react-icons/io5";

function Fav() {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("userToken");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const domain = "http://localhost:8080";

  async function getData() {
    setLoading(true);
    try {
      const response = await fetch(`${domain}/api/FavItems/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const responsedata = await response.json();
      if (response.ok) {
        console.log("Fetched Fav Items:", responsedata);
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

  async function handleRemove(id) {
    try {
      const response = await fetch(`${domain}/api/removeFavItem/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        getData();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const addtocart = async (element) => {
    if (!userId) {
      alert("Please login first to add to cart.");
      return;
    }

    // const cartItem = {
    //   userId,
    //   productId: element._id,
    //   img: element.img,
    //   productName: element.productName,
    //   description: element.description,
    //   price: element.price,
    //   qty: element.qty || 1,
    // };

    // console.log("Sending cart item:", cartItem);

    try {
      const response = await fetch(`${domain}/api/addToCart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(element),
      });

      const responseData = await response.json();
      // console.log("Full server response:", responseData);

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

  if (!userId) return <Notfound />;

  return (
    <div className="min-h-screen  bg-gray-50 pt-23 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Favorites
          </h1>
          <p className="text-gray-600">Your saved items are waiting for you</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && data.length === 0 && (
          <div className="text-center py-20">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No favorites yet
            </h3>
            <p className="text-gray-500">
              Start adding items to your favorites to see them here
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && data.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {data.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group"
              >
                {/* Product Image */}
                <div className="relative overflow-hidden bg-gray-100">
                  <img
                    src={product.img}
                    alt={product.productName || "Product image"}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 gap-2 flex right-2">
                    <button className="p-1 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors">
                      <svg
                        className="w-4 h-4 text-red-500 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>
                  </div>
                  <div
                    onClick={() => handleRemove(product._id)}
                    className=" absolute left-2 top-2 bg-[#ffffffab] rounded-full w-8 h-8 flex justify-center items-center"
                  >
                    <IoTrashBin className="text-2xl text-red-500" />
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                    {product.productName}
                  </h3>
                  <p className=" text-gray-500 text-sm mb-2 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-gray-900">
                        ${product.price}
                      </span>
                      {product.qty && (
                        <span className="text-xs text-gray-500">
                          Qty: {product.qty}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addtocart(product)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-3 rounded-md transition-colors duration-200 flex items-center justify-center space-x-1 group text-sm"
                  >
                    <svg
                      className="w-4 h-4 group-hover:scale-110 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 1.5M7 13l1.5 1.5m4.5-1.5h6"
                      />
                    </svg>
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Fav;
