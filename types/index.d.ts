export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  user: string;
  priority?: number; // 1 (Low) - 5 (High)
}
