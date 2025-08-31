/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;

      login(user, token);
      localStorage.setItem("token", token);

      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-800 p-4 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-8 transition-colors duration-300"
      >
  <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          Welcome Back 👋
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            />
          </div>

          {/* Password with toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none pr-10 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-indigo-600 dark:bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 dark:hover:bg-indigo-800 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        {/* Error message */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-sm text-red-600 text-center"
          >
            {error}
          </motion.p>
        )}

        {/* Redirect */}
  <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-300">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-indigo-600 dark:text-indigo-400 cursor-pointer font-medium hover:underline"
          >
            Sign up
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
