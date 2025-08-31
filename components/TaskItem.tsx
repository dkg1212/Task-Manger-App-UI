/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import api from "../lib/api";
import { motion } from "framer-motion";

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
      if (onStatusChange) onStatusChange();
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
      if (onStatusChange) onStatusChange();
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
      if (onStatusChange) onStatusChange();
    } catch (err) {
      console.error("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 p-3 border rounded-lg mb-2 bg-white shadow-sm"
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
    >
      <div className="flex items-center gap-2 flex-1">
        <input
          type="checkbox"
          checked={completed}
          onChange={handleToggle}
          disabled={loading}
        />

        {isEditing ? (
          <form
            onSubmit={handleEditSubmit}
            className="flex flex-col md:flex-row gap-2 flex-1"
          >
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Description"
            />
            <button
              type="submit"
              className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
              disabled={loading}
            >
              Save
            </button>
            <button
              type="button"
              className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </form>
        ) : (
          <div className="flex flex-col md:flex-row md:items-center flex-1 gap-2">
            <span
              className={`text-lg ${
                completed ? "line-through text-gray-400" : ""
              }`}
            >
              {title}
            </span>
            {description && (
              <span className="text-sm text-gray-500">{description}</span>
            )}
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            disabled={loading}
          >
            Delete
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default TaskItem;
