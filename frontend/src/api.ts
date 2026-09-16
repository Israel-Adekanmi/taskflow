import type { Task, TaskStatus } from './types';

const BASE_URL =
  (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000';

export interface ApiResponse<T> {
  error: boolean;
  message: string;
  data: T;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  console.log(`Request to ${BASE_URL}${path}:`, res);

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;

    try {
      const body = await res.json();

      if (body.message) {
        message = Array.isArray(body.message)
          ? body.message.join(', ')
          : body.message;
      }
    } catch {
      // Ignore parse errors
    }

    throw new Error(message);
  }

  const text = await res.text();

  return (text ? JSON.parse(text) : undefined) as T;
}

// ====================
// Authentication
// ====================

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

export interface LoginData {
  accessToken: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export const authApi = {
  signup: (
    data: SignupPayload,
  ): Promise<ApiResponse<unknown>> =>
    request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (
    data: LoginPayload,
  ): Promise<ApiResponse<LoginData>> =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ====================
// Tasks
// ====================

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
  list: (
    token: string,
    status?: string,
  ): Promise<ApiResponse<Task[]>> => {
    const qs =
      status && status !== 'all'
        ? `?status=${status}`
        : '';

    return request(`/tasks${qs}`, {}, token);
  },

  get: (
    token: string,
    id: string,
  ): Promise<ApiResponse<Task>> =>
    request(`/tasks/${id}`, {}, token),

  create: (
    token: string,
    data: CreateTaskPayload,
  ): Promise<ApiResponse<Task>> =>
    request(
      '/tasks',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      token,
    ),

  update: (
    token: string,
    id: string,
    data: UpdateTaskPayload,
  ): Promise<ApiResponse<Task>> =>
    request(
      `/tasks/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      },
      token,
    ),

  delete: (
    token: string,
    id: string,
  ): Promise<ApiResponse<null>> =>
    request(
      `/tasks/${id}`,
      {
        method: 'DELETE',
      },
      token,
    ),
};