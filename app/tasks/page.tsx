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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* Floating circles */}
      <motion.div
        className="absolute w-72 h-72 bg-white/10 rounded-full blur-3xl"
        animate={{ y: [0, -30, 0], x: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: "20%", left: "10%" }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-pink-400/10 rounded-full blur-3xl"
        animate={{ y: [0, 40, 0], x: [0, -40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{ bottom: "10%", right: "5%" }}
      />

      {/* Glassmorphism container */}
      <div className="relative z-10 w-full max-w-4xl p-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl">
        <h1 className="text-4xl font-bold mb-6 text-blue-700 text-center">
          Task Dashboard
        </h1>

        {/* Tabs */}
        <div className="flex justify-center mb-6 gap-3">
          {["all", "completed", "pending"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeTab === tab
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab(tab as any)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
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
                  {filteredTasks.map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          key={task._id}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-4 bg-white shadow rounded-lg border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 hover:shadow-lg transition"
                        >
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
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
                      )}
                    </Draggable>
                  ))}
                </AnimatePresence>
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>

        {loading && (
          <p className="text-gray-500 mt-4 text-center">Loading tasks...</p>
        )}
        {error && (
          <p className="text-red-500 mt-4 text-center">{error}</p>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
