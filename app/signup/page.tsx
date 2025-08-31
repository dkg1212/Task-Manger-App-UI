/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

const SignupPage = () => {
  const { login } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
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
      const res = await api.post("/auth/register", {
        username,
        email,
        password,
      });
      const { user, token } = res.data;

      login(user, token);
      localStorage.setItem("token", token);

      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md rounded-2xl bg-white/80 dark:bg-gray-900/90 p-8 shadow-xl backdrop-blur-lg transition-colors duration-300"
      >
  <h1 className="mb-6 text-center text-3xl font-bold text-gray-800 dark:text-gray-100">
          Create an Account ✨
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-3 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400 dark:bg-gray-800"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-3 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400 dark:bg-gray-800"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-3 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400 dark:bg-gray-800"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className={`w-full rounded-xl bg-pink-600 dark:bg-pink-700 py-3 font-semibold text-white shadow-md transition duration-300 hover:bg-pink-700 dark:hover:bg-pink-800 ${
              loading && "cursor-not-allowed opacity-70"
            }`}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </motion.button>
        </form>

        {/* Error message */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center text-sm font-medium text-red-500"
          >
            {error}
          </motion.p>
        )}

  <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <a href="/login" className="font-semibold text-pink-600 dark:text-pink-400 hover:underline">
            Log in
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
