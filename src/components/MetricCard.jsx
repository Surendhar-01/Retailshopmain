import clsx from 'clsx';
import { formatCurrency, formatNumber } from '../utils/formatters';

export function MetricCard({ title, value, tone = 'default', hint, currency = false }) {
  return (
    <div
      className={clsx(
        'panel p-5',
        tone === 'accent' && 'bg-gradient-to-br from-brand-500 to-brand-700 text-white',
        tone === 'warning' && 'bg-gradient-to-br from-amber-400 to-orange-500 text-white',
      )}
    >
      <p className={clsx('text-sm', tone === 'default' ? 'text-slate-500 dark:text-slate-400' : 'text-white/80')}>
        {title}
      </p>
      <h3 className="mt-3 text-3xl font-semibold">
        {currency ? formatCurrency(value) : formatNumber(value)}
      </h3>
      {hint && <p className={clsx('mt-2 text-sm', tone === 'default' ? 'text-slate-500' : 'text-white/80')}>{hint}</p>}
    </div>
  );
}
