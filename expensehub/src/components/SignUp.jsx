// src/SignUp.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

function SignUp() {
  const auth = useAuth();   // ✅ safer destructure
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [error, setError] = useState("");

  if (!auth) {
    return <p className="text-center text-red-500">⚠ AuthContext not found</p>;
  }

  const { login } = auth;

  // Password strength checker
  const getPasswordStrength = (pass) => {
    if (!pass) return "";
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    const mediumRegex = /^(?=.*[a-z])(?=.*\d).{6,}$/;

    if (strongRegex.test(pass)) return "strong";
    if (mediumRegex.test(pass)) return "medium";
    return "weak";
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (strength !== "strong") {
      setError("Password must be strong to continue");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // 🔹 Mock signup (replace with real API later)
    const newUser = {
      id: Date.now(),
      name,
      email,
      role,
      token: "fake-jwt-token",
    };

    // Save in localStorage + AuthContext
    localStorage.setItem("user", JSON.stringify(newUser));
    login(newUser);

    toast.success("Signup successful!");

    // ✅ Navigate based on role
    switch (role) {
      case "admin":
        navigate("/admin");
        break;
      case "manager":
        navigate("/manager");
        break;
      default:
        navigate("/employee");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Create Account
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Name"
            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-1 focus:ring-amber-400"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-1 focus:ring-amber-400"
          />

          {/* Password input */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-1 focus:ring-amber-400"
          />

          {/* Confirm Password input */}
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-1 focus:ring-amber-400"
          />

          {/* Password strength */}
          {password && (
            <p
              className={`text-sm ${
                strength === "strong"
                  ? "text-green-600"
                  : strength === "medium"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {strength === "strong"
                ? "✅ Strong password"
                : strength === "medium"
                ? "⚠️ Medium password"
                : "❌ Weak password"}
            </p>
          )}

          {/* Role selection */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-1 focus:ring-amber-400"
          >
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>

          {/* Submit button */}
          <button
            type="submit"
            disabled={strength !== "strong"}
            className={`w-full py-2 mt-2 text-white rounded-lg transition ${
              strength === "strong"
                ? "bg-amber-500 hover:bg-amber-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Sign Up
          </button>

          {/* Error message */}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </form>

        {/* Already have account link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-amber-600 font-medium hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
