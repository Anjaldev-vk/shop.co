import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { forgotPassword } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
        setError("Please enter your email.");
        return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      await forgotPassword(email);
      setMessage("OTP sent to your email.");
      setTimeout(() => {
          navigate("/reset-password", { state: { email } });
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10">
        <h2 className="text-2xl font-bold text-center text-black mb-4">
          Forgot Password
        </h2>
        <p className="text-center text-gray-500 mb-6">
            Enter your email to receive a password reset OTP.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 shadow-sm"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center font-semibold">{error}</p>
          )}
          {message && (
            <p className="text-green-500 text-sm text-center font-semibold">{message}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 disabled:bg-indigo-400 transition-all duration-300 shadow-md"
          >
            {isLoading ? "Sending..." : "Send OTP"}
          </button>
        </form>
         <div className="mt-4 text-center">
            <Link to="/login" className="text-indigo-600 hover:underline text-sm">Back to Login</Link>
         </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
