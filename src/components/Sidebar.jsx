import clsx from 'clsx';
import {
  BarChart3,
  Boxes,
  ClipboardList,
  LayoutDashboard,
  PackageSearch,
  Receipt,
  Settings2,
  ShoppingCart,
  Tags,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/billing', label: 'Billing', icon: Receipt },
  { to: '/sales', label: 'Sales', icon: ShoppingCart },
  { to: '/stock', label: 'Stock', icon: Boxes },
  { to: '/pricing', label: 'Pricing', icon: Tags },
  { to: '/products', label: 'Products', icon: PackageSearch },
  { to: '/reports', label: 'Reports', icon: ClipboardList },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings2 },
];

export function Sidebar({ open, onClose }) {
  return (
    <>
      <div
        className={clsx(
          'fixed inset-0 z-30 bg-slate-950/40 transition md:hidden',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 w-72 border-r border-white/10 bg-slate-950 px-5 py-6 text-slate-100 transition md:static md:translate-x-0 md:rounded-[2rem]',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-300">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Retail OS</p>
            <h1 className="text-lg font-semibold">Shop Manager</h1>
          </div>
        </div>

        <nav className="mt-8 space-y-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
                  isActive
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-950/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Workflow</p>
          <h2 className="mt-2 font-semibold">Weekly refill ready</h2>
          <p className="mt-2 text-sm text-slate-400">
            Track manual stock sheets, live prices, billing, and performance from one dashboard.
          </p>
        </div>
      </aside>
    </>
  );
}
