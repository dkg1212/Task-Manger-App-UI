/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import api from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Circle, Loader2, Trash2, Edit3, X } from "lucide-react";

type TaskItemProps = {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  onStatusChange?: () => void;
};

const TaskItem: React.FC<TaskItemProps> = ({
  _id,
  title: initialTitle,
  description: initialDescription,
  completed,
  onStatusChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription || "");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleToggle = async () => {
    if (!token) return;
    setLoading(true);
    try {
      await api.put(
        `/tasks/${_id}`,
        { completed: !completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onStatusChange?.();
    } catch (err) {
      console.error("Failed to toggle task status");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!token) return;
    setLoading(true);
    try {
      await api.delete(`/tasks/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onStatusChange?.();
    } catch (err) {
      console.error("Failed to delete task");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    try {
      await api.put(
        `/tasks/${_id}`,
        { title, description, completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEditing(false);
      onStatusChange?.();
    } catch (err) {
      console.error("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02, boxShadow: "0px 4px 15px rgba(0,0,0,0.1)" }}
      className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-4 border rounded-xl mb-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm transition"
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
    >
      <div className="flex items-start gap-3 flex-1 ">
        {/* Animated Checkbox */}
        <motion.button
          onClick={handleToggle}
          disabled={loading}
          whileTap={{ scale: 0.9 }}
          className="mt-1"
        >
          {completed ? (
            <CheckCircle className="text-green-500 w-6 h-6" />
          ) : (
            <Circle className="text-gray-400 dark:text-gray-500 w-6 h-6" />
          )}
        </motion.button>

        {/* Content */}
        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="flex flex-col gap-2 w-full">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-3 py-2 rounded border dark:bg-gray-700 dark:text-gray-100"
              required
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="px-3 py-2 rounded border dark:bg-gray-700 dark:text-gray-100"
              placeholder="Description"
            />
            <div className="flex gap-2">
              <motion.button
                type="submit"
                whileTap={{ scale: 0.95 }}
                className="px-4 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-1"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </motion.button>
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                className="px-4 py-1 bg-gray-300 dark:bg-gray-600 rounded-lg hover:bg-gray-400"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </motion.button>
            </div>
          </form>
        ) : (
          <div>
            <span
              className={`block text-lg font-medium ${
                completed ? "line-through text-gray-400 dark:text-gray-500" : "dark:text-gray-100"
              }`}
            >
              {title}
            </span>
            {description && (
              <span className="text-sm text-gray-500 dark:text-gray-300">{description}</span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {!isEditing && (
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsEditing(true)}
            className="p-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white"
          >
            <Edit3 size={16} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            disabled={loading}
            className="p-2 rounded-lg bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800 text-white"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 size={16} />}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsEditing(false)}
            className="p-2 rounded-lg bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 text-black dark:text-white"
          >
            <X size={16} />
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default TaskItem;
