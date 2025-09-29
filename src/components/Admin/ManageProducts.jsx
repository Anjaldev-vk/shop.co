import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- Form Component for Adding/Editing Products (No changes needed here) ---
const ProductFormModal = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || '',
    count: product?.count || '', // Stock
    category: product?.category || '',
    brand: product?.brand || '',
    description: product?.description || '',
    images: product?.images || [''],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.count) {
        alert("Please fill in Name, Price, and Stock.");
        return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">{product ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Product Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Price (₹)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block font-medium">Stock (Count)</label>
              <input type="number" name="count" value={formData.count} onChange={handleChange} className="w-full p-2 border rounded" required />
            </div>
          </div>
           <div>
            <label className="block font-medium">Brand</label>
            <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block font-medium">Category</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block font-medium">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" rows="3"></textarea>
          </div>
          <div>
             <label className="block font-medium">Image URL</label>
             <input type="text" placeholder="https://example.com/image.jpg" value={formData.images[0]} onChange={(e) => handleImageChange(0, e.target.value)} className="w-full p-2 border rounded" />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onCancel} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Cancel</button>
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Save Product</button>
          </div>
        </form>
      </div>
    </div>
  );
};


const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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

  // --- <<< CORRECTED AND IMPROVED handleSave FUNCTION >>> ---
  const handleSave = async (formData) => {
    if (editingProduct) {
      // --- UPDATE LOGIC ---
      // Merge existing data with form data to prevent fields from being erased
      const updatedProduct = {
        ...editingProduct, // Start with all original data
        ...formData,      // Overwrite with the edited fields from the form
        price: parseFloat(formData.price),
        count: parseInt(formData.count, 10),
      };

      try {
        const response = await axios.put(`http://localhost:3001/products/${editingProduct.id}`, updatedProduct);
        setProducts(products.map(p => (p.id === editingProduct.id ? response.data : p)));
        alert("Product updated successfully!");
      } catch (error) {
        console.error("Error updating product:", error);
        alert("Failed to update product.");
      }
    } else {
      // --- CREATE LOGIC ---
      const newProduct = {
        ...formData,
        price: parseFloat(formData.price),
        count: parseInt(formData.count, 10),
        // Add default values for fields not in the form
        rating: 4.5, // Example default
        isNewArrival: true,
        isTopSelling: false,
        created_at: new Date().toISOString(),
        colors: [],
        sizes: []
      };

      try {
        const response = await axios.post("http://localhost:3001/products", newProduct);
        setProducts([...products, response.data]);
        alert("Product added successfully!");
      } catch (error) {
        console.error("Error adding product:", error);
        alert("Failed to add product.");
      }
    }
    handleCloseModal();
  };


  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:3001/products/${productId}`);
        setProducts(products.filter(p => p.id !== productId));
        alert("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product.");
      }
    }
  };

  if (loading) return <div className="text-center p-10">Loading products...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {isModalOpen && (
        <ProductFormModal 
          product={editingProduct}
          onSave={handleSave}
          onCancel={handleCloseModal}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Products 📦</h1>
        <button onClick={handleAddProduct} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 shadow font-semibold">
          + Add New Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 font-semibold">Image</th>
              <th className="p-3 font-semibold">Name</th>
              <th className="p-3 font-semibold">Price</th>
              <th className="p-3 font-semibold">Stock</th>
              <th className="p-3 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <img src={product.images?.[0] || 'https://via.placeholder.com/150'} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                </td>
                <td className="p-3 font-medium">{product.name}</td>
                <td className="p-3">₹{product.price?.toFixed(2)}</td>
                <td className="p-3">{product.count}</td>
                <td className="p-3 text-center">
                  <button onClick={() => handleEditProduct(product)} className="text-blue-600 hover:underline font-medium mr-4">Edit</button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProducts;