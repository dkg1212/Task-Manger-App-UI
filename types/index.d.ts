export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface Task {
  _id: string;
  title: string;
  completed: boolean;
  user: string;
}
