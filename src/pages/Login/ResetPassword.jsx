import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ResetPassword = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { resetPassword } = useContext(AuthContext);

  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
        setError("Passwords do not match.");
        return;
    }
    if (newPassword.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      await resetPassword(email, otp, newPassword);
      setMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
     return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-red-500">Invalid access. Please start from forgot password page.</p>
        </div>
     );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10">
        <h2 className="text-2xl font-bold text-center text-black mb-4">
          Reset Password
        </h2>
        <p className="text-center text-gray-500 mb-6">
            Enter OTP sent to {email} and your new password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
             <label className="text-sm font-semibold text-gray-700">OTP</label>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 shadow-sm"
              required
            />
          </div>
           <div>
             <label className="text-sm font-semibold text-gray-700">New Password</label>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 shadow-sm"
              required
            />
          </div>
           <div>
             <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
