import { useState, useEffect } from 'react';
import type { AuthState, Screen } from './types';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import TaskDetailPage from './pages/TaskDetailPage';
import CreateTaskPage from './pages/CreateTaskPage';
import EditTaskPage from './pages/EditTaskPage';

const AUTH_KEY = 'taskflow_auth';

function loadAuth(): AuthState | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveAuth(auth: AuthState | null) {
  if (auth) localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  else localStorage.removeItem(AUTH_KEY);
}

export default function App() {
  const [auth, setAuth] = useState<AuthState | null>(loadAuth);
  const [screen, setScreen] = useState<Screen>(
    loadAuth() ? { name: 'dashboard' } : { name: 'login' }
  );

  useEffect(() => {
    saveAuth(auth);
  }, [auth]);

  function handleLogin(newAuth: AuthState) {
    setAuth(newAuth);
    setScreen({ name: 'dashboard' });
  }

  function handleLogout() {
    setAuth(null);
    setScreen({ name: 'login' });
  }

  function navigate(s: Screen) {
    setScreen(s);
  }

  // Redirect to login if no auth and trying to access protected screen
  if (!auth && screen.name !== 'login' && screen.name !== 'signup') {
    return <LoginPage onLogin={handleLogin} onGoSignup={() => setScreen({ name: 'signup' })} />;
  }

  switch (screen.name) {
    case 'login':
      return <LoginPage onLogin={handleLogin} onGoSignup={() => setScreen({ name: 'signup' })} />;

    case 'signup':
      return <SignupPage onGoLogin={() => setScreen({ name: 'login' })} />;

    case 'dashboard':
      return <DashboardPage auth={auth!} onLogout={handleLogout} onNavigate={navigate} />;

    case 'task-detail':
      return <TaskDetailPage taskId={screen.taskId} auth={auth!} onNavigate={navigate} />;

    case 'create-task':
      return <CreateTaskPage auth={auth!} onNavigate={navigate} />;

    case 'edit-task':
      return <EditTaskPage taskId={screen.taskId} auth={auth!} onNavigate={navigate} />;
  }
}
