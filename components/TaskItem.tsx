import React from 'react';

import api from '../lib/api';

type TaskItemProps = {
  _id: string;
  title: string;
  completed: boolean;
  onStatusChange?: () => void;
};

const TaskItem: React.FC<TaskItemProps> = ({ _id, title, completed, onStatusChange }) => {
  const handleToggle = async () => {
    const token = localStorage.getItem('token');
    await api.put(`/tasks/${_id}`, { completed: !completed }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (onStatusChange) onStatusChange();
  };

  return (
    <div>
      <input type="checkbox" checked={completed} onChange={handleToggle} />
      <span>{title}</span>
    </div>
  );
};

export default TaskItem;
