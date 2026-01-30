// // src/components/Cart/Cart.jsx
// import React from "react";
// import { useCart } from "../../context/CartContext";
// import { useNavigate } from "react-router-dom";

// const Cart = () => {
//   const { cart, addToCart, decrementCartItem, removeFromCart, clearCart } = useCart();
//   const navigate = useNavigate();

//   if (!cart || cart.length === 0) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
//         <h2 className="text-2xl font-bold text-gray-700 mb-4">Your Cart is Empty 🛒</h2>
//         <p className="text-gray-500">Start shopping to add products here.</p>
//       </div>
//     );
//   }

//   const getItemPrice = (item) => item.discountedPrice ?? item.price ?? 0;

//   const calculateTotal = () =>
//     cart.reduce((acc, item) => acc + getItemPrice(item) * (item.quantity || 1), 0).toFixed(2);

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Cart 🛒</h2>

//       <div className="space-y-6 max-w-3xl mx-auto">
//         {cart.map((item) => (
//           <div key={item.id} className="flex items-center bg-white rounded-lg shadow p-4">
//             <img
//               src={item.images?.[0] || "https://via.placeholder.com/120"}
//               alt={item.name || "Product Image"}
//               className="w-24 h-24 object-cover rounded-md"
//             />
//             <div className="ml-4 flex-1">
//               <h3 className="text-lg font-semibold">{item.name || "Unnamed Product"}</h3>
//               <p className="text-gray-600">
//                 Price: {Number(getItemPrice(item)).toFixed(2)} × {item.quantity || 1}₹
//               </p>
//               <p className="text-gray-800 font-bold">
//                 Total: {(getItemPrice(item) * (item.quantity || 1)).toFixed(2)}₹
//               </p>

//               {/* Increment / Decrement Buttons */}
//               <div className="flex items-center space-x-2 mt-2">
//                 <button
//                   onClick={() => decrementCartItem(item.id)}
//                   className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
//                 >
//                   -
//                 </button>
//                 <span className="px-3 py-1">{item.quantity}</span>
//                 <button
//                   onClick={() => addToCart(item)}
//                   className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
//                 >
//                   +
//                 </button>
//               </div>
//             </div>

//             <button
//               onClick={() => removeFromCart(item.id)}
//               className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
//             >
//               Remove
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Cart Footer with Total and Buttons */}
//       <div className="mt-8 flex flex-col md:flex-row justify-between items-center max-w-3xl mx-auto gap-4">
//         <button
//           onClick={clearCart}
//           className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 w-full md:w-auto"
//         >
//           Clear Cart
//         </button>

//         <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto justify-between md:justify-end">
//           <p className="text-xl font-bold text-gray-800">
//             Total: {calculateTotal()}₹
//           </p>
//           <button
//             onClick={() => navigate("/checkout")}
//             className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 w-full md:w-auto"
//           >
//             Checkout
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;











// src/components/Cart/Cart.jsx
import React from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

import { formatPrice } from "../../utils/formatPrice";

const Cart = () => {
  const { cart, addToCart, decrementCartItem, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  // This is the section for when the cart is empty.
  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Your Cart is Empty 🛒</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
        
        
        <button
          onClick={() => navigate('/products')}
          className="bg-black text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors shadow"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  // Use cartTotal from context if available, or simpler calculation
  const totalAmount = cart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);

  // This is the section for when the cart has items.
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center md:text-left">Your Cart 🛒</h2>

      <div className="space-y-6 max-w-3xl mx-auto">
        {cart.map((item) => (
          <div key={item.id} className="flex flex-col sm:flex-row items-center bg-white rounded-lg shadow p-4 gap-4">
            <img
              src={item.image || "https://via.placeholder.com/120"}
              alt={item.name || "Product Image"}
              className="w-24 h-24 object-cover rounded-md"
            />
            <div className="ml-4 flex-1 text-center sm:text-left">
              <h3 className="text-lg font-semibold">{item.name || "Unnamed Product"}</h3>
              <p className="text-gray-600">
                Price: {formatPrice(item.price)} × {item.quantity || 1}
              </p>
              <p className="text-gray-800 font-bold">
                Total: {formatPrice((item.price || 0) * (item.quantity || 1))}
              </p>

              {/* Increment / Decrement Buttons */}
              <div className="flex items-center justify-center sm:justify-start space-x-2 mt-2">
                <button
                  onClick={() => decrementCartItem(item.id)}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition"
                >
                  -
                </button>
                <span className="px-3 py-1 font-semibold">{item.quantity}</span>
                <button
                  onClick={() => addToCart(item)}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={() => removeFromCart(item.id)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition self-center sm:self-auto"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Cart Footer with Total and Buttons */}
      <div className="mt-8 flex flex-col md:flex-row justify-between items-center max-w-3xl mx-auto gap-4">
        <button
          onClick={clearCart}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition w-full md:w-auto"
        >
          Clear Cart
        </button>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <p className="text-xl font-bold text-gray-800">
            Total: {formatPrice(totalAmount)}
          </p>
          <button
            onClick={() => navigate("/checkout")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition w-full md:w-auto"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;