import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    address: "",
    paymentMethod: "card",
  });

  useEffect(() => {
    if (currentUser) {
      setUserInfo((prevInfo) => ({
        ...prevInfo,
        name: currentUser.username || "",
        email: currentUser.email || "",
      }));
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const subtotal = cart.reduce(
    (acc, item) =>
      acc + (item.discountedPrice ?? item.price ?? 0) * (item.quantity || 1),
    0
  );
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setError("Please log in to place an order.");
      navigate("/login");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      // ✅ 1. Create an array of promises for each stock update.
      const updateStockPromises = cart.map(item => {
        // Find the original product data to get the current stock count.
        // This assumes the 'cart' object has the full product details, including 'count'.
        // If not, you might need to fetch it first.
        const newCount = item.count - item.quantity;
        return axios.patch(`http://localhost:3001/products/${item.id}`, {
          // Ensure stock doesn't go below zero.
          count: newCount >= 0 ? newCount : 0,
        });
      });

      // ✅ 2. Execute all stock update requests simultaneously.
      // If any of these fail, it will throw an error and the order won't be placed.
      await Promise.all(updateStockPromises);

      // ✅ 3. If stock updates are successful, proceed to create the order.
      const newOrder = {
        userId: currentUser.id,
        customerInfo: userInfo,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          discountedPrice: item.discountedPrice,
          quantity: item.quantity,
          image: item.images?.[0] || null,
        })),
        total: total,
        orderDate: new Date().toISOString(),
        status: "Pending",
      };

      // Post the new order to the database.
      await axios.post("http://localhost:3001/orders", newOrder);

      // ✅ 4. Clear the cart and navigate to the profile page on success.
      clearCart();
      navigate("/profile");

    } catch (err) {
      console.error("Failed to place order:", err);
      setError("There was an error placing your order. Inventory may have changed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Your Cart is Empty 🛒
        </h2>
        <p className="text-gray-500">Add some products before checkout.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Checkout
      </h1>
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-8">
        {/* Cart Summary */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div className="flex items-center gap-3">
                {item.images?.[0] && (
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-500 text-sm">
                    {item.quantity} × {(item.discountedPrice ?? item.price ?? 0).toFixed(2)}₹
                  </p>
                </div>
              </div>
              <p className="font-semibold">
                {(
                  (item.discountedPrice ?? item.price ?? 0) *
                  (item.quantity || 1)
                ).toFixed(2)}₹
              </p>
            </div>
          ))}
          <div className="border-t pt-2 mt-2 space-y-2">
            <p className="flex justify-between font-medium text-gray-600">
              Subtotal: <span>{subtotal.toFixed(2)}₹</span>
            </p>
            <p className="flex justify-between font-medium text-gray-600">
              Tax (5%): <span>{tax.toFixed(2)}₹</span>
            </p>
            <p className="flex justify-between font-bold text-lg mt-1">
              Total: <span>{total.toFixed(2)}₹</span>
            </p>
          </div>
        </div>

        {/* User Info Form */}
        <div className="md:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Your Information</h2>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={userInfo.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="email"
              name="email"
              value={userInfo.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              name="address"
              value={userInfo.address}
              onChange={handleChange}
              placeholder="Shipping Address"
              required
              rows="3"
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div>
              <label className="font-medium mb-1 block">Payment Method</label>
              <select
                name="paymentMethod"
                value={userInfo.paymentMethod}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="card">Credit / Debit Card</option>
                <option value="paypal">PayPal</option>
                <option value="cod">Cash on Delivery</option>
              </select>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={isProcessing}
              className="bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;