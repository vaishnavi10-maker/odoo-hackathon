import React, { useState } from "react";

function SignUp() {
  const [password, setPassword] = useState("");

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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Create Account
        </h2>

        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter Name"
            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-1 focus:ring-amber-400"
          />
          <input
            type="email"
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
                ? "Strong password"
                : strength === "medium"
                ? " Medium password"
                : " Weak password"}
            </p>
          )}

          {/* Currency Dropdown */}
          <select
            id="currency"
            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-1 focus:ring-amber-400"
          >
            <option value="">Select Currency</option>
            <option value="INR">Indian Rupee</option>
            <option value="USD">US Dollar</option>
            <option value="EUR">Euro</option>
            <option value="GBP">British Pound</option>
            <option value="JPY">Japanese Yen</option>
            <option value="AUD">Australian Dollar</option>
            <option value="CAD">Canadian Dollar</option>
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
        </form>
      </div>
    </div>
  );
}

export default SignUp;
