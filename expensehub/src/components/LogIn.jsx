// src/LogIn.jsx
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LogIn() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Email validation
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    setIsLoading(true);

    // 🔹 Mock login logic (replace with API call later)
    setTimeout(() => {
      let role = null;
      if (email === "admin@example.com" && password === "admin123") {
        role = "admin";
      } else if (email === "manager@example.com" && password === "manager123") {
        role = "manager";
      } else if (email === "employee@example.com" && password === "employee123") {
        role = "employee";
      }

      if (role) {
        login({ id: 1, name: email.split("@")[0], role, token: "fake-jwt-token" });

        // Redirect based on role
        if (role === "admin") navigate("/admin");
        if (role === "manager") navigate("/manager");
        if (role === "employee") navigate("/employee");
      } else {
        setError("Invalid email or password");
      }

      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Log In Account
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-1 focus:ring-amber-400"
          />

          {/* Password with toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-1 focus:ring-amber-400 pr-10"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          {/* Error message */}
          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="text-right text-sm">
            <a href="#" className="text-amber-500 hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className={`w-full py-2 mt-2 text-white rounded-lg transition flex items-center justify-center ${
              isLoading || !email || !password
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-amber-500 hover:bg-amber-600"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Logging in...
              </div>
            ) : (
              "Log In"
            )}
          </button>

          <div className="text-center text-sm">
            Don't have an account?{" "}
            <a href="/signup" className="text-amber-500 hover:underline">
              Sign Up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
