"use client";
import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-100 to-blue-200 px-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-2xl p-10 max-w-xl w-full text-center"
      >
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold text-blue-600 mb-4"
        >
          Welcome {user ? user.username : "to Task Manager"}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-gray-700 text-lg md:text-xl mb-6"
        >
          Your one-stop solution for managing tasks efficiently.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex justify-center gap-4"
        >
          <a
            href="/tasks"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition"
          >
            View Tasks
          </a>
          {!user ? (
            <a
              href="/signup"
              className="px-6 py-3 bg-green-500 text-white rounded-xl shadow-lg hover:bg-green-600 transition"
            >
              Get Started
            </a>
          ) : (
            <span className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl shadow-lg">
              {user.username}
            </span>
          )}
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-10 w-full max-w-xl text-center text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <p>Stay organized, stay productive. 🚀</p>
      </motion.div>
    </div>
  );
}
