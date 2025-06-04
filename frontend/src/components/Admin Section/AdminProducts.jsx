import React, { useState, useEffect } from "react";

function AdminProducts() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    category: "",
    img: null,
  });

  const domain = "http://localhost:8080";
  const token = localStorage.getItem("adminToken");

  async function getData() {
    setLoading(true);
    try {
      const response = await fetch(`${domain}/api/products`);
      const responsedata = await response.json();
      if (response.ok) {
        setData(responsedata);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  }

  async function deleteProduct(id) {
    try {
      const res = await fetch(`${domain}/api/deleteProduct/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        alert("Product deleted");
        getData();
      }
    } catch (error) {
      console.error("error in deleting product", error);
    }
  }

  function resetForm() {
    setFormData({
      productName: "",
      description: "",
      price: "",
      category: "",
      img: null,
    });
  }

  function handleAddProduct() {
    setShowAddForm(true);
    resetForm();
  }

  function handleEditProduct(product) {
    setEditingProduct(product);
    setFormData({
      productName: product.productName,
      description: product.description,
      price: product.price,
      category: product.category,
      img: null,
    });
    setShowEditForm(true);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      img: file,
    }));
  }

  async function handleFormSubmit() {
    if (
      !formData.productName ||
      !formData.description ||
      !formData.price ||
      !formData.category
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const form = new FormData();
    form.append("productName", formData.productName);
    form.append("description", formData.description);
    form.append("price", formData.price);
    form.append("category", formData.category);
    if (formData.img) {
      form.append("img", formData.img);
    }

    try {
      if (showAddForm) {
        const response = await fetch(`${domain}/api/addProduct`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        });

        const output = await response.json();
        if (response.ok) {
          alert(output.message || "Product added successfully");
          getData();
        }
      } else if (showEditForm && editingProduct) {
        const response = await fetch(
          `${domain}/api/updateProduct/${editingProduct._id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: form,
          }
        );

        const output = await response.json();
        if (response.ok) {
          alert(output.message || "Product updated successfully");
          getData();
        }
      }
    } catch (error) {
      console.error("Error in submitting product", error);
    }

    closeModal();
  }

  function closeModal() {
    setShowAddForm(false);
    setShowEditForm(false);
    setEditingProduct(null);
    resetForm();
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="bg-gray-50  ">
      <header className="bg-white shadow">
        <div className="max-w-7xl  mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Products Management
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <div className="text-xl font-semibold text-gray-700">
            All Products ({data.length})
          </div>
          <button
            onClick={handleAddProduct}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium shadow-sm"
          >
            Add New Product
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-lg text-gray-700">
              Loading products...
            </span>
          </div>
        ) : (
          <>
            {data.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-500 text-lg">No products found</p>
                <button
                  onClick={handleAddProduct}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
                >
                  Add Your First Product
                </button>
              </div>
            ) : (
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-md object-cover"
                                src={product.img || "/api/placeholder/400/320"}
                                alt={product.productName}
                                onError={(e) => {
                                  e.target.src = "/api/placeholder/400/320";
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product.productName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                            {product.description}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                            {product.category}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-600">
                            ${parseFloat(product.price).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Update
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => deleteProduct(product._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>

      {(showAddForm || showEditForm) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {showAddForm ? "Add New Product" : "Edit Product"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter product description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                {/* <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="smartphone etc"
                /> */}
                <select
                  name="category"
                  id="cat"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="smartphone etc"
                >
                  <option value={formData.category}>
                    {formData.category || "Seletect Category"}
                  </option>
                  <option value="Smart Phones">Smart Phones</option>
                  <option value="Laptops">Laptops</option>
                  <option value="Watches">Hand Watches</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Gagets">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image
                </label>
                <input
                  type="file"
                  name="img"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full px-3 py-2 border rounded-md"
                />
                {formData.img && (
                  <p className="text-sm text-green-600 mt-1">
                    Selected: {formData.img.name}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleFormSubmit}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md"
                >
                  {showAddForm ? "Add Product" : "Update Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
