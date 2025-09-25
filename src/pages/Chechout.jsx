import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext"; // ✅ import AuthContext

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { currentUser } = useContext(AuthContext); // ✅ get logged in user
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    address: "",
    paymentMethod: "card",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Save order only if user is logged in
    if (currentUser) {
      const newOrder = {
        id: Date.now(), // unique order id
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          discountedPrice: item.discountedPrice,
          quantity: item.quantity,
          image: item.image, // ✅ include image
        })),
        total,
        userInfo,
        date: new Date().toISOString(),
      };

      // fetch previous orders for this user
      const existingOrders =
        JSON.parse(localStorage.getItem(`orders_${currentUser.username}`)) || [];

      // add new order
      const updatedOrders = [...existingOrders, newOrder];
      localStorage.setItem(
        `orders_${currentUser.username}`,
        JSON.stringify(updatedOrders)
      );
    }

    alert(`Order placed successfully! Total: $${total.toFixed(2)}`);
    clearCart();
    navigate("/profile"); // ✅ redirect to profile so they see the order
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
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-6">
        {/* Cart Summary */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div className="flex items-center gap-3">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-500 text-sm">
                    {item.quantity} × ${item.discountedPrice ?? item.price ?? 0}
                  </p>
                </div>
              </div>
              <p className="font-semibold">
                $
                {(
                  (item.discountedPrice ?? item.price ?? 0) *
                  (item.quantity || 1)
                ).toFixed(2)}
              </p>
            </div>
          ))}
          <div className="border-t pt-2 mt-2">
            <p className="flex justify-between font-medium">
              Subtotal: <span>${subtotal.toFixed(2)}</span>
            </p>
            <p className="flex justify-between font-medium">
              Tax (5%): <span>${tax.toFixed(2)}</span>
            </p>
            <p className="flex justify-between font-bold text-lg mt-1">
              Total: <span>${total.toFixed(2)}</span>
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
            <button
              type="submit"
              className="bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition mt-4"
            >
              Place Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
