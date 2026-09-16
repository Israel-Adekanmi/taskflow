import { useEffect, useState } from 'react';
import { tasksApi } from '../api';
import type { Task, TaskStatus, AuthState, Screen } from '../types';

interface Props {
  taskId: string;
  auth: AuthState;
  onNavigate: (screen: Screen) => void;
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export default function EditTaskPage({ taskId, auth, onNavigate }: Props) {
  const [original, setOriginal] = useState<Task | null>(null);
  const [form, setForm] = useState({ title: '', description: '', status: 'pending' as TaskStatus, dueDate: '' });
  const [errors, setErrors] = useState<{ title?: string; dueDate?: string; api?: string }>({});
  const [loadingTask, setLoadingTask] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setLoadingTask(true);
    tasksApi.get(auth.token, taskId)
      .then(task => {
        setOriginal(task);
        setForm({
          title: task.title,
          description: task.description ?? '',
          status: task.status,
          dueDate: task.dueDate.split('T')[0],
        });
      })
      .catch(e => setLoadError(e instanceof Error ? e.message : 'Failed to load task'))
      .finally(() => setLoadingTask(false));
  }, [auth.token, taskId]);

  function set<K extends keyof typeof form>(field: K, value: typeof form[K]) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) setErrors(prev => ({ ...prev, [field]: undefined }));
  }

  function validate() {
    const e: typeof errors = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.dueDate) e.dueDate = 'Due date is required';
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setSaving(true);
    try {
      await tasksApi.update(auth.token, taskId, {
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        dueDate: new Date(form.dueDate).toISOString(),
      });
      setSuccess(true);
    } catch (err) {
      setErrors({ api: err instanceof Error ? err.message : 'Failed to save changes' });
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f2f7]">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <button
            onClick={() => onNavigate(original ? { name: 'task-detail', taskId } : { name: 'dashboard' })}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {original ? 'Task' : 'Tasks'}
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-sm text-slate-500">Edit</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {loadingTask ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
            <div className="skeleton h-5 w-1/2 rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-24 w-full rounded" />
            <div className="skeleton h-4 w-1/3 rounded" />
          </div>
        ) : loadError ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <p className="text-sm text-red-600 mb-3">{loadError}</p>
            <button onClick={() => onNavigate({ name: 'dashboard' })} className="text-sm text-indigo-600 hover:underline">
              Back to tasks
            </button>
          </div>
        ) : success ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Changes saved!</h2>
            <p className="text-sm text-slate-500 mb-6">Your task has been updated successfully.</p>
            <button
              onClick={() => onNavigate({ name: 'task-detail', taskId })}
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              View task
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="p-6 sm:p-8 border-b border-slate-100">
              <h1 className="text-lg font-bold text-slate-900">Edit task</h1>
              {original && <p className="text-sm text-slate-500 mt-0.5 truncate">{original.title}</p>}
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5" noValidate>
              {errors.api && (
                <div className="px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {errors.api}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  className={`w-full px-3 py-2.5 text-sm rounded-lg border outline-none focus:ring-2 focus:ring-indigo-300 transition-colors ${
                    errors.title ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-indigo-400'
                  }`}
                  disabled={saving}
                />
                {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:border-indigo-400 outline-none focus:ring-2 focus:ring-indigo-300 transition-colors resize-none"
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Status</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {STATUS_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => set('status', opt.value)}
                      disabled={saving}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        form.status === opt.value
                          ? opt.value === 'pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-300'
                            : opt.value === 'in-progress'
                            ? 'bg-blue-50 text-blue-700 border-blue-300'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Due date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={e => set('dueDate', e.target.value)}
                  className={`w-full px-3 py-2.5 text-sm rounded-lg border outline-none focus:ring-2 focus:ring-indigo-300 transition-colors font-mono ${
                    errors.dueDate ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-indigo-400'
                  }`}
                  disabled={saving}
                />
                {errors.dueDate && <p className="mt-1 text-xs text-red-600">{errors.dueDate}</p>}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate(original ? { name: 'task-detail', taskId } : { name: 'dashboard' })}
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60 flex items-center gap-2 shadow-sm"
                >
                  {saving && (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
