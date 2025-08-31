"use client";

import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Task } from '../../types';
import TaskItem from '../../components/TaskItem';
import TaskForm from '../../components/TaskForm';

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: unknown) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h1>Tasks</h1>
      <TaskForm onTaskCreated={fetchTasks} />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <TaskItem
              _id={task._id}
              title={task.title}
              completed={task.completed}
              onStatusChange={fetchTasks}
            />
            {task.description && <div style={{ fontSize: '0.9em', color: '#555' }}>{task.description}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksPage;
