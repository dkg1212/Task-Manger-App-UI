"use client";
import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-100 to-blue-200 dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-800 px-4 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 max-w-xl w-full text-center transition-colors duration-300"
      >
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-300 mb-4"
        >
          Welcome {user ? user.username : "to Task Manager"}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-gray-700 dark:text-gray-300 text-lg md:text-xl mb-6"
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
            className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-xl shadow-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition"
            onClick={e => {
              if (!user) {
                e.preventDefault();
                alert("Please login to see your tasks.");
              }
            }}
          >
            View Tasks
          </a>
          {!user ? (
            <a
              href="/signup"
              className="px-6 py-3 bg-green-500 dark:bg-green-700 text-white rounded-xl shadow-lg hover:bg-green-600 dark:hover:bg-green-800 transition"
            >
              Get Started
            </a>
          ) : (
            <span className="px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl shadow-lg">
              {user.username}
            </span>
          )}
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-10 w-full max-w-xl text-center text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <p>Stay organized, stay productive. 🚀</p>
      </motion.div>
    </div>
  );
}
