/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import { Task } from "../../types";
import TaskItem from "../../components/TaskItem";
import TaskForm from "../../components/TaskForm";
import { motion, AnimatePresence } from "framer-motion";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "completed" | "pending">(
    "all"
  );

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err: unknown) {
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const completedTasks = tasks.filter((task) => task.completed);
  const pendingTasks = tasks.filter((task) => !task.completed);

  const filteredTasks =
    activeTab === "all"
      ? tasks
      : activeTab === "completed"
      ? completedTasks
      : pendingTasks;

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(filteredTasks);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);

    let newTasks: Task[] = [];
    if (activeTab === "all") newTasks = items;
    else if (activeTab === "completed") {
      newTasks = tasks.map((t) =>
        t.completed ? items.find((i) => i._id === t._id) || t : t
      );
    } else {
      newTasks = tasks.map((t) =>
        !t.completed ? items.find((i) => i._id === t._id) || t : t
      );
    }

    setTasks(newTasks);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Background Glow Animation */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-pink-400/30 blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-indigo-400/30 blur-3xl right-10 top-20"
        animate={{ scale: [1.2, 1, 1.2] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      {/* Glassmorphism container */}
      <motion.div
        layout
        className="relative z-10 w-full max-w-4xl p-6 bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-4xl font-bold mb-6 text-blue-700 dark:text-blue-300 text-center">
          Task Dashboard
        </h1>

        {/* Tabs */}
        <div className="flex justify-center mb-6 gap-3">
          {["all", "completed", "pending"].map((tab) => (
            <motion.button
              key={tab}
              whileTap={{ scale: 0.95 }}
              whileHover={{ y: -2 }}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeTab === tab
                  ? "bg-blue-500 dark:bg-blue-700 text-white shadow-md"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab(tab as any)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Add Task */}
        <div className="mb-6">
          <TaskForm onTaskCreated={fetchTasks} />
        </div>

        {/* Tasks List */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <ul
                className="space-y-3"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <AnimatePresence>
                  {filteredTasks.length === 0 && !loading && (
                    <motion.div
                      className="text-center text-gray-500 dark:text-gray-400 py-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      🎉 No tasks here! Add one above.
                    </motion.div>
                  )}

                  {filteredTasks.map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                    >
                      {(provided, snapshot) => {
                        return (
                          <li
                            key={task._id}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700"
                          >
                            <motion.div
                              layout
                              whileHover={{ scale: 1.02 }}
                              animate={{
                                boxShadow: snapshot.isDragging
                                  ? "0px 5px 20px rgba(0,0,0,0.2)"
                                  : "0px 2px 6px rgba(0,0,0,0.05)",
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              <TaskItem
                                _id={task._id}
                                title={task.title}
                                description={task.description}
                                completed={task.completed}
                                onStatusChange={fetchTasks}
                              />
                            </motion.div>
                          </li>
                        );
                      }}
                    </Draggable>
                  ))}
                </AnimatePresence>
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>

        {loading && (
          <p className="text-gray-500 dark:text-gray-300 mt-4 text-center">
            Loading tasks...
          </p>
        )}
        {error && (
          <p className="text-red-500 mt-4 text-center">{error}</p>
        )}
      </motion.div>
    </div>
  );
};

export default TasksPage;
