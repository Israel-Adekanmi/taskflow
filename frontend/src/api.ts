import type { Task, TaskStatus } from './types';

const BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000';

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const body = await res.json();
      if (body.message) message = Array.isArray(body.message) ? body.message.join(', ') : body.message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: { id: string; firstName: string; lastName: string; email: string };
}

export const authApi = {
  signup: (data: SignupPayload) =>
    request('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: LoginPayload): Promise<LoginResponse> =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
};

export interface CreateTaskPayload {
  title: string;
  description: string;
  dueDate: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
}

export const tasksApi = {
  list: (token: string, status?: string): Promise<Task[]> => {
    const qs = status && status !== 'all' ? `?status=${status}` : '';
    return request(`/tasks${qs}`, {}, token);
  },

  get: (token: string, id: string): Promise<Task> =>
    request(`/tasks/${id}`, {}, token),

  create: (token: string, data: CreateTaskPayload): Promise<Task> =>
    request('/tasks', { method: 'POST', body: JSON.stringify(data) }, token),

  update: (token: string, id: string, data: UpdateTaskPayload): Promise<Task> =>
    request(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, token),

  delete: (token: string, id: string): Promise<void> =>
    request(`/tasks/${id}`, { method: 'DELETE' }, token),
};
