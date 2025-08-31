/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import api from '../lib/api';
import { motion, number } from 'framer-motion';

interface TaskFormProps {
  onTaskCreated?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [priority, setPriority] = useState(3); // Default medium

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized');



      const res = await api.post(
        '/tasks',
        { title, description, priority },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Save priority in localStorage by task ID
      const localPriorities = JSON.parse(localStorage.getItem("taskPriorities") || "{}")
      localPriorities[res.data._id] = priority;
      localStorage.setItem("taskPriorities", JSON.stringify(localPriorities));

  setTitle('');
  setDescription('');
  setPriority(3);
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
      className="max-w-2xl mx-auto backdrop-blur-xl bg-white/70 dark:bg-black/50 p-8 rounded-2xl 
      shadow-lg border border-white/20 dark:border-white/30 relative z-10 "
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
        className='w-full flex-1 p-3 outline-none border rounded-md bg-white/80 dark:bg-[#2a004a]/40 
            border-gray-300 dark:border-white/40 focus:ring-2 focus:ring-purple-400 my-2 text-black dark:text-white'
      />
      <textarea
        rows={6}
        placeholder="Description (optional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
        
        className='w-full p-4 outline-none border rounded-md bg-white/80 dark:bg-[#2a004a]/40 
          border-gray-300 dark:border-white/40 focus:ring-2 focus:ring-orange-400 text-black dark:text-white'
      />
      
      <select
        value={priority}
        onChange={e => setPriority(Number(e.target.value))}
        className="flex-1 w-2/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
      >
        <option value={5}>High</option>
        <option value={4}>Above Average</option>
        <option value={3}>Medium</option>
        <option value={2}>Low</option>
        <option value={1}>Very Low</option>
      </select>
      <motion.button
        type="submit"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-6 py-3  rounded-lg text-white text-xs font-semibold transition absolute right-8 ${
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
