import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-700">You are not logged in.</p>
        <Link to="/login" className="text-indigo-600">Login</Link> |{" "}
        <Link to="/signup" className="text-indigo-600">Signup</Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg text-center">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <p className="mb-2"><strong>Username:</strong> {user.username}</p>
      <p className="mb-2"><strong>Email:</strong> {user.email}</p>
      <p className="mb-4"><strong>Role:</strong> {user.role}</p>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
