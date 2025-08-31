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
import { Plus } from "lucide-react";

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "completed" | "pending">(
    "all"
  );

  // Fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const localPriorities = JSON.parse(localStorage.getItem("taskPriorities") || "{}");
      const merged = res.data.map((task: any) => ({
        ...task,
        priority: localPriorities[task._id] ?? task.priority ?? 3,
      }));
      setTasks(merged);
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

  let filteredTasks: Task[] = [];
  if (activeTab === "all") {
    const pending = tasks.filter(t => !t.completed).sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
    const completed = tasks.filter(t => t.completed).sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
    filteredTasks = [...pending, ...completed];
  } else if (activeTab === "completed") {
    filteredTasks = completedTasks.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  } else {
    filteredTasks = pendingTasks.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  }

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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden 
    bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
    dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 px-2 sm:px-4">
      
      {/* Background Glow */}
      <motion.div
        className="absolute w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full bg-pink-400/30 blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] rounded-full bg-indigo-400/30 blur-3xl right-5 sm:right-10 top-10 sm:top-20"
        animate={{ scale: [1.2, 1, 1.2] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      {/* Container */}
      <motion.div
        layout
        className="relative z-10 w-full max-w-4xl p-4 sm:p-6 lg:p-10 bg-white/80 dark:bg-gray-900/90 
        backdrop-blur-xl rounded-2xl shadow-2xl"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-blue-700 dark:text-blue-300 text-center">
          Task Dashboard
        </h1>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row justify-center mb-6 gap-2 sm:gap-3">
          {["all", "completed", "pending"].map((tab) => (
            <motion.button
              key={tab}
              whileTap={{ scale: 0.95 }}
              whileHover={{ y: -2 }}
              className={`px-4 py-2 rounded-lg font-semibold transition text-sm sm:text-base ${
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

        {/* Add Task Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-600 text-white 
            hover:bg-blue-500 transition shadow-lg"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 backdrop-blur-sm"
            >
              <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl shadow-2xl w-full max-w-md mx-2 mt-8 relative flex flex-col items-center justify-center">
                <button
                  onClick={() => setShowForm(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-xl font-bold"
                  aria-label="Close"
                >
                  &times;
                </button>
                <TaskForm onTaskCreated={() => { setShowForm(false); fetchTasks(); }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Priority Legend */}
        <div className={showForm ? "pointer-events-none blur-sm select-none" : ""}>
          <div className="flex flex-wrap justify-end mb-2 gap-1 sm:gap-2 text-[10px] sm:text-xs">
            {["5: High","4: Above Avg","3: Medium","2: Low","1: Very Low"].map((label, i) => (
              <span key={i} className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold">
                {label}
              </span>
            ))}
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
                        className="text-center text-gray-500 dark:text-gray-400 py-8 text-sm sm:text-base"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        🎉 No tasks here! Add one above.
                      </motion.div>
                    )}

                    {filteredTasks.map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided, snapshot) => (
                          <li
                            key={task._id}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-3 sm:p-4 bg-white dark:bg-gray-800 shadow rounded-lg border 
                            border-gray-200 dark:border-gray-700 w-full"
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
                                priority={task.priority}
                                onStatusChange={fetchTasks}
                                showPriority
                              />
                            </motion.div>
                          </li>
                        )}
                      </Draggable>
                    ))}
                  </AnimatePresence>
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {loading && <p className="text-gray-500 dark:text-gray-300 mt-4 text-center">Loading tasks...</p>}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </motion.div>
    </div>
  );
};

export default TasksPage;
