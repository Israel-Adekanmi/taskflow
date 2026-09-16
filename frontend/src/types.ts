export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type FilterStatus = 'all' | TaskStatus | 'overdue';

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  isOverdue: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthState {
  token: string;
  user: User;
}

export type Screen =
  | { name: 'login' }
  | { name: 'signup' }
  | { name: 'dashboard' }
  | { name: 'task-detail'; taskId: string }
  | { name: 'create-task' }
  | { name: 'edit-task'; taskId: string };
