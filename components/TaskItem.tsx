import React from 'react';

type TaskItemProps = {
  title: string;
  completed: boolean;
};

const TaskItem: React.FC<TaskItemProps> = ({ title, completed }) => {
  return (
    <div>
      <input type="checkbox" checked={completed} readOnly />
      <span>{title}</span>
    </div>
  );
};

export default TaskItem;
