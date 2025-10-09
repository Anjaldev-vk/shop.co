import React, { useState, useEffect, useMemo } from "react";
import api from "../api/axiosConfig";
import toast from "react-hot-toast";

// --- Form Component for Adding/Editing Products ---
const ProductFormModal = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || "",
    count: product?.count || "", 
    category: product?.category || "",
    brand: product?.brand || "",
    description: product?.description || "",
    images: product?.images || [""],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.count) {
      toast.error("Please fill in Name, Price, and Stock.");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {product ? "Edit Product" : "Add New Product"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">
                Stock (Count)
              </label>
              <input
                type="number"
                name="count"
                value={formData.count}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
          </div>
          <div>
            <label className="block font-medium text-gray-700">Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              rows="3"
            ></textarea>
          </div>
          <div>
            <label className="block font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              value={formData.images[0]}
              onChange={(e) => handleImageChange(0, e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Manage Products ---
const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    if (!products) return [];
    return [...new Set(products.map((p) => p.category).filter(Boolean))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) =>
        filterCategory ? product.category === filterCategory : true
      )
      .filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [products, searchTerm, filterCategory]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSave = async (formData) => {
    if (editingProduct) {
      const updatedProduct = {
        ...editingProduct,
        ...formData,
        price: parseFloat(formData.price),
        count: parseInt(formData.count, 10),
      };

      try {
        const response = await api.put(
          `/products/${editingProduct.id}`,
          updatedProduct
        );
        setProducts(
          products.map((p) =>
            p.id === editingProduct.id ? response.data : p
          )
        );
        toast.success("Product updated successfully!");
      } catch (error) {
        console.error("Error updating product:", error);
        toast.error("Failed to update product.");
      }
    } else {
      const newProduct = {
        ...formData,
        price: parseFloat(formData.price),
        count: parseInt(formData.count, 10),
        rating: 4.5,
        isNewArrival: true,
        isTopSelling: false,
        created_at: new Date().toISOString(),
        colors: [],
        sizes: [],
      };

      try {
        const response = await api.post(
          "/products",
          newProduct
        );
        setProducts([response.data, ...products]); 
        toast.success("Product added successfully!");
      } catch (error) {
        console.error("Error adding product:", error);
        toast.error("Failed to add product.");
      }
    }
    handleCloseModal();
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${productId}`);
        setProducts(products.filter((p) => p.id !== productId));
        toast.success("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product.");
      }
    }
  };

  if (loading)
    return <div className="text-center p-10">Loading products...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {isModalOpen && (
        <ProductFormModal
          product={editingProduct}
          onSave={handleSave}
          onCancel={handleCloseModal}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Products</h1>
        <button
          onClick={handleAddProduct}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 shadow font-semibold"
        >
          + Add New Product
        </button>
      </div>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-lg py-2 pl-10 pr-4 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
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

        <div className="flex items-center gap-2">
          <label
            htmlFor="category-filter"
            className="font-medium text-gray-700"
          >
            Category:
          </label>
          <select
            id="category-filter"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border rounded-lg py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-indigo-50 text-gray-700 border-b">
              <th className="p-3 font-semibold">Image</th>
              <th className="p-3 font-semibold">Name</th>
              <th className="p-3 font-semibold">Price</th>
              <th className="p-3 font-semibold">Stock</th>
              <th className="p-3 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <tr
                  key={product.id}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-indigo-50 transition`}
                >
                  <td className="p-3">
                    <img
                      src={product.images?.[0] || "https://via.placeholder.com/150"}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md shadow-sm"
                    />
                  </td>
                  <td className="p-3 font-medium text-gray-800">
                    {product.name}
                  </td>
                  <td className="p-3 text-gray-600">
                    ₹{product.price?.toFixed(2)}
                  </td>
                  <td className="p-3 text-gray-600">{product.count}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="text-blue-600 hover:underline font-medium mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:underline font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center p-10 text-gray-500 italic"
                >
                  No products found. Try adjusting your search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProducts;