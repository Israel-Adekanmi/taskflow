import { useEffect, useState } from 'react';
import { tasksApi } from '../api';
import type { Task, AuthState, Screen } from '../types';
import TaskStatusBadge from '../components/TaskStatusBadge';
import OverdueBadge from '../components/OverdueBadge';
import DeleteTaskDialog from '../components/DeleteTaskDialog';

interface Props {
  taskId: string;
  auth: AuthState;
  onNavigate: (screen: Screen) => void;
}

function formatDateLong(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function TaskDetailPage({ taskId, auth, onNavigate }: Props) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    tasksApi.get(auth.token, taskId)
      .then(setTask)
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load task'))
      .finally(() => setLoading(false));
  }, [auth.token, taskId]);

  return (
    <div className="min-h-screen bg-[#f0f2f7]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <button
            onClick={() => onNavigate({ name: 'dashboard' })}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tasks
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-sm text-slate-500 truncate">{task?.title ?? 'Task detail'}</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
            <div className="skeleton h-6 w-3/4 rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-5/6 rounded" />
            <div className="skeleton h-4 w-2/3 rounded" />
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <p className="text-sm text-red-600 mb-3">{error}</p>
            <button
              onClick={() => onNavigate({ name: 'dashboard' })}
              className="text-sm text-indigo-600 hover:underline"
            >
              Back to tasks
            </button>
          </div>
        ) : task ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="p-6 sm:p-8">
              {/* Title and badges */}
              <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
                <h1 className="text-xl font-bold text-slate-900 leading-snug">{task.title}</h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <TaskStatusBadge status={task.status} />
                  {task.isOverdue && <OverdueBadge />}
                </div>
              </div>

              {/* Description */}
              {task.description && (
                <p className="text-sm text-slate-600 leading-relaxed mb-6 whitespace-pre-wrap">{task.description}</p>
              )}

              {/* Meta */}
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 border-t border-slate-100">
                <div>
                  <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Status</dt>
                  <dd><TaskStatusBadge status={task.status} /></dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Due date</dt>
                  <dd className={`text-sm font-medium font-mono ${task.isOverdue ? 'text-red-600' : 'text-slate-700'}`}>
                    {formatDateLong(task.dueDate)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Created</dt>
                  <dd className="text-sm font-medium font-mono text-slate-700">{formatDateLong(task.createdAt)}</dd>
                </div>
                {task.isOverdue && (
                  <div>
                    <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Overdue</dt>
                    <dd><OverdueBadge /></dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Footer actions */}
            <div className="px-6 sm:px-8 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex items-center justify-between gap-3">
              <button
                onClick={() => setDeleteOpen(true)}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => onNavigate({ name: 'edit-task', taskId: task.id })}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
              >
                Edit task
              </button>
            </div>
          </div>
        ) : null}
      </main>

      {task && deleteOpen && (
        <DeleteTaskDialog
          task={task}
          token={auth.token}
          onDeleted={() => onNavigate({ name: 'dashboard' })}
          onCancel={() => setDeleteOpen(false)}
        />
      )}
    </div>
  );
}
