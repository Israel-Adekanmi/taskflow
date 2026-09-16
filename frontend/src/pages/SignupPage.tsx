import { useState } from 'react';
import { authApi } from '../api';

interface Props {
  onGoLogin: () => void;
}

export default function SignupPage({ onGoLogin }: Props) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Partial<typeof form> & { api?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function set(field: keyof typeof form, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function validate() {
    const e: typeof errors = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Minimum 8 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    try {
      await authApi.signup({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
      setSuccess(true);
    } catch (err) {
      setErrors({ api: err instanceof Error ? err.message : 'Signup failed' });
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Account created!</h2>
          <p className="text-sm text-slate-500 mb-6">Your TaskFlow account is ready. Sign in to get started.</p>
          <button
            onClick={onGoLogin}
            className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 mb-4 shadow-lg shadow-indigo-200">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Instrument Serif', serif" }}>
            TaskFlow
          </h1>
          <p className="text-sm text-slate-500 mt-1">Create your account</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          {errors.api && (
            <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {errors.api}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">First name</label>
                <input
                  value={form.firstName}
                  onChange={e => set('firstName', e.target.value)}
                  placeholder="Jane"
                  className={`w-full px-3 py-2.5 text-sm rounded-lg border outline-none focus:ring-2 focus:ring-indigo-300 transition-colors ${
                    errors.firstName ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-indigo-400'
                  }`}
                  disabled={loading}
                />
                {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Last name</label>
                <input
                  value={form.lastName}
                  onChange={e => set('lastName', e.target.value)}
                  placeholder="Doe"
                  className={`w-full px-3 py-2.5 text-sm rounded-lg border outline-none focus:ring-2 focus:ring-indigo-300 transition-colors ${
                    errors.lastName ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-indigo-400'
                  }`}
                  disabled={loading}
                />
                {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="you@example.com"
                className={`w-full px-3 py-2.5 text-sm rounded-lg border outline-none focus:ring-2 focus:ring-indigo-300 transition-colors ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-indigo-400'
                }`}
                disabled={loading}
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                placeholder="Min. 8 characters"
                className={`w-full px-3 py-2.5 text-sm rounded-lg border outline-none focus:ring-2 focus:ring-indigo-300 transition-colors ${
                  errors.password ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-indigo-400'
                }`}
                disabled={loading}
              />
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Confirm password</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={e => set('confirmPassword', e.target.value)}
                placeholder="••••••••"
                className={`w-full px-3 py-2.5 text-sm rounded-lg border outline-none focus:ring-2 focus:ring-indigo-300 transition-colors ${
                  errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-indigo-400'
                }`}
                disabled={loading}
              />
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm"
            >
              {loading && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          Already have an account?{' '}
          <button onClick={onGoLogin} className="text-indigo-600 font-medium hover:underline">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
