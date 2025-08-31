/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import api from '../lib/api';
import { motion } from 'framer-motion';

interface TaskFormProps {
  onTaskCreated?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized');

      const res = await api.post(
        '/tasks',
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTitle('');
      setDescription('');
      if (onTaskCreated) onTaskCreated();
    } catch (err: unknown) {
      setError('Failed to create task. Make sure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row gap-3 items-center mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
      />
      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
      />
      <motion.button
        type="submit"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-6 py-2 rounded-lg text-white font-semibold transition ${
          loading ? 'bg-blue-300 dark:bg-blue-800 cursor-not-allowed' : 'bg-blue-500 dark:bg-blue-700 hover:bg-blue-600 dark:hover:bg-blue-800'
        }`}
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Task'}
      </motion.button>
  {error && <p className="text-red-500 mt-2">{error}</p>}
    </motion.form>
  );
};

export default TaskForm;
