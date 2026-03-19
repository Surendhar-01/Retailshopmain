import { Bell, Menu, Search } from 'lucide-react';
import { useMemo } from 'react';
import { useStore } from '../store/useStore';

export function Header({ onMenuClick }) {
  const notifications = useStore((state) => state.notifications);
  const currentUser = useStore((state) => state.currentUser);

  const alertCount = useMemo(
    () => notifications.filter((notification) => notification.type === 'warning').length,
    [notifications],
  );

  return (
    <header className="panel flex items-center gap-3 px-4 py-4 md:px-6">
      <button type="button" className="btn-secondary md:hidden" onClick={onMenuClick}>
        <Menu className="h-4 w-4" />
      </button>

      <div className="hidden flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950 md:flex">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          placeholder="Search products, sales, reports..."
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button type="button" className="btn-secondary relative">
          <Bell className="h-4 w-4" />
          {alertCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
              {alertCount}
            </span>
          )}
        </button>
        <div className="rounded-2xl border border-slate-200 px-4 py-2 dark:border-slate-800">
          <p className="text-xs text-slate-500">Signed in as</p>
          <p className="text-sm font-semibold">{currentUser?.name}</p>
        </div>
      </div>
    </header>
  );
}
