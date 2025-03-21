import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react"; // Eye icons for password toggle

const LoginForm = () => {
  const [udiseCode, setUdiseCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useAuth();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate(user.role === "admin" ? "/admin" : "/user", { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("https://srkvm.vercel.app/api/auth/login", {
        udiseCode,
        password,
      });
  
      const token = response.data.token;
      login(token); // Save token & update user context
  
      const decoded = jwtDecode(token);
      localStorage.setItem("userId", decoded.userId); // Store user ID
  
      navigate(decoded.role === "admin" ? "/admin" : "/user", { replace: true });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong!";
      setError(errorMessage);
    }

    setLoading(false);
  };

  return (
    <div
    className="h-screen flex flex-col justify-center items-center bg-cover bg-center"
    style={{ backgroundImage: "url('/bgs.gif')" }}
  >
  
      {/* srkvm.gif Image */}
      

      <form onSubmit={handleLogin} className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-center text-xl mb-4">Login</h2>
        
        <div className="mb-4">
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Udise Code"
            value={udiseCode}
            onChange={(e) => setUdiseCode(e.target.value)}
          />
        </div>
        
        <div className="mb-4 relative">
          <input
            type={showPassword ? "text" : "password"}
            className="input input-bordered w-full pr-10"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {loading && (
          <div className="flex justify-center mb-4">
            <span className="loading loading-spinner text-primary"></span>
          </div>
        )}

        <button type="submit" className="btn btn-primary w-full mb-2" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <button 
          type="button" 
          className="btn btn-secondary w-full"
          onClick={() => navigate("/register")} // Navigate to Registration Form
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
