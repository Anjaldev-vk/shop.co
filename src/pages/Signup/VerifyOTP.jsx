import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOtp, resendOtp } = useContext(AuthContext);

  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      await verifyOtp(email, otp);
      setMessage("Account verified successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
        await resendOtp(email);
        setMessage("OTP resent successfully.");
    } catch (err) {
        setError(err.message || "Failed to resend OTP");
    }
  }

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Invalid access. Please signup or login first.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-gray-100 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          Verify OTP
        </h2>
        <p className="text-center text-gray-600">
            Enter the OTP sent to <strong>{email}</strong>
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label htmlFor="otp" className="sr-only">
              OTP
            </label>
            <input
              id="otp"
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-center text-xl tracking-widest"
              maxLength={6}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center pt-2">{error}</p>
          )}
           {message && (
            <p className="text-green-500 text-sm text-center pt-2">{message}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm font-semibold text-white bg-black hover:bg-gray-800 disabled:bg-indigo-400 transition-all duration-300"
          >
            {isLoading ? "Verifying..." : "Verify Account"}
          </button>
        </form>
        
        <div className="text-center mt-4">
            <button
                onClick={handleResend}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold"
            >
                Resend OTP
            </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
