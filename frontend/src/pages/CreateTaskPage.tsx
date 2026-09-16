import { useState } from 'react';
import { tasksApi } from '../api';
import type { AuthState, Screen } from '../types';

interface Props {
  auth: AuthState;
  onNavigate: (screen: Screen) => void;
}

export default function CreateTaskPage({ auth, onNavigate }: Props) {
  const [form, setForm] = useState({ title: '', description: '', dueDate: '' });
  const [errors, setErrors] = useState<Partial<typeof form> & { api?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function set(field: keyof typeof form, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  }

  function validate() {
    const e: typeof errors = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.dueDate) e.dueDate = 'Due date is required';
    else if (new Date(form.dueDate) < new Date(new Date().toDateString())) {
      // allow today; only error if truly invalid
    }
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    try {
      await tasksApi.create(auth.token, {
        title: form.title.trim(),
        description: form.description.trim(),
        dueDate: new Date(form.dueDate).toISOString(),
      });
      setSuccess(true);
    } catch (err) {
      setErrors({ api: err instanceof Error ? err.message : 'Failed to create task' });
      setLoading(false);
    }
  }

  // min date for the date picker = today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-[#f0f2f7]">
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
          <span className="text-sm text-slate-500">New task</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {success ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Task created!</h2>
            <p className="text-sm text-slate-500 mb-6">Your task has been added with status <strong>Pending</strong>.</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => { setSuccess(false); setForm({ title: '', description: '', dueDate: '' }); }}
                className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Create another
              </button>
              <button
                onClick={() => onNavigate({ name: 'dashboard' })}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Back to tasks
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="p-6 sm:p-8 border-b border-slate-100">
              <h1 className="text-lg font-bold text-slate-900">New task</h1>
              <p className="text-sm text-slate-500 mt-0.5">New tasks start with status <strong>Pending</strong>.</p>
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
                  placeholder="What needs to be done?"
                  className={`w-full px-3 py-2.5 text-sm rounded-lg border outline-none focus:ring-2 focus:ring-indigo-300 transition-colors ${
                    errors.title ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-indigo-400'
                  }`}
                  disabled={loading}
                />
                {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  placeholder="Add more detail about this task…"
                  rows={4}
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:border-indigo-400 outline-none focus:ring-2 focus:ring-indigo-300 transition-colors resize-none"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Due date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.dueDate}
                  min={today}
                  onChange={e => set('dueDate', e.target.value)}
                  className={`w-full px-3 py-2.5 text-sm rounded-lg border outline-none focus:ring-2 focus:ring-indigo-300 transition-colors font-mono ${
                    errors.dueDate ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-indigo-400'
                  }`}
                  disabled={loading}
                />
                {errors.dueDate && <p className="mt-1 text-xs text-red-600">{errors.dueDate}</p>}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate({ name: 'dashboard' })}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60 flex items-center gap-2 shadow-sm"
                >
                  {loading && (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {loading ? 'Creating…' : 'Create task'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
