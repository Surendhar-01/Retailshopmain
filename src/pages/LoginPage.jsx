import { LockKeyhole, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export function LoginPage() {
  const login = useStore((state) => state.login);
  const [form, setForm] = useState({ username: 'admin', password: 'admin123' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = login(form);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/60 bg-white/90 shadow-soft dark:border-slate-800 dark:bg-slate-900/90 md:grid-cols-[1.15fr_0.85fr]">
        <div className="bg-slate-950 p-10 text-white">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-300">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <p className="mt-8 text-xs uppercase tracking-[0.4em] text-brand-300">Retail Shop Management</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight">
            Billing, stock sheets, pricing, and reporting in one modern dashboard.
          </h1>
          <p className="mt-5 max-w-lg text-slate-300">
            Built for oil and grocery workflows with refill tracking, price history, printable invoices, and role-based login.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-300">Admin Demo</p>
              <p className="mt-2 font-semibold">admin / admin123</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-300">Staff Demo</p>
              <p className="mt-2 font-semibold">staff / staff123</p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
              <LockKeyhole className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Sign in</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Use the demo credentials to explore the full workflow.</p>
            </div>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <input
              className="input"
              placeholder="Username"
              value={form.username}
              onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
            />
            <input
              className="input"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            />
            {error && <p className="text-sm text-rose-500">{error}</p>}
            <button className="btn-primary w-full" type="submit">
              Enter dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
