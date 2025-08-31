/* eslint-disable @typescript-eslint/no-unused-vars */
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

    // Update main tasks array
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
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-blue-600 text-center">
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                  <Draggable key={task._id} draggableId={task._id} index={index}>
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
  );
};

export default TasksPage;
