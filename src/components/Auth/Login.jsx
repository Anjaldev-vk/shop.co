// // src/pages/Login.js
// import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { AuthContext } from "../../context/AuthContext";

// const Login = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Fetch user from JSON server
//       const res = await axios.get(
//         `http://localhost:3001/users?username=${username}&password=${password}`
//       );

//       if (res.data.length === 0) {
//         setError("Invalid username or password");
//         return;
//       }

//       const user = res.data[0];
//       login(user); // update context + localStorage immediately
//       navigate("/profile"); // redirect to protected profile page
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
//       <h2 className="text-2xl mb-4">Login</h2>
//       <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           className="p-2 border rounded"
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="p-2 border rounded"
//         />
//         <button type="submit" className="bg-blue-600 text-white p-2 rounded">
//           Login
//         </button>
//         {error && <p className="text-red-500">{error}</p>}
//       </form>
//     </div>
//   );
// };

// export default Login;






















// src/pages/Login.js
// src/pages/Login.js
import React, { useState, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page user tried to visit (default to /profile)
  const from = location.state?.from?.pathname || "/profile";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Fetch user from JSON server
      const res = await axios.get(
        `http://localhost:3001/users?username=${username}&password=${password}`
      );

      if (res.data.length === 0) {
        setError("Invalid username or password");
        return;
      }

      const user = res.data[0];
      login(user); // update context + localStorage immediately

      // Redirect to the page the user originally wanted
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Login
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>

      {/* Sign Up Option */}
      <p className="mt-4 text-center text-gray-700">
        Don't have an account?{" "}
        <Link to="/signup" className="text-blue-600 hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;

