import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartCard } from '../components/ChartCard';
import { chartTooltipProps } from '../components/chartTheme';
import { DataTable } from '../components/DataTable';
import { MetricCard } from '../components/MetricCard';
import { SectionTitle } from '../components/SectionTitle';
import { useStore } from '../store/useStore';
import {
  getDashboardMetrics,
  getProductPerformance,
  getSalesTrend,
  getStockMovement,
} from '../utils/analytics';
import { formatDateTime } from '../utils/formatters';

export function DashboardPage() {
  const products = useStore((state) => state.products);
  const sales = useStore((state) => state.sales);
  const notifications = useStore((state) => state.notifications);
  const stockHistory = useStore((state) => state.stockHistory);

  const metrics = getDashboardMetrics({ products, sales });
  const salesTrend = getSalesTrend(sales);
  const stockMovement = getStockMovement(stockHistory, products);
  const performance = getProductPerformance(sales, products);

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Overview"
        title="Retail shop control center"
        description="Track daily billing, refill cycles, live stock positions, and pricing changes from one dashboard."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Today's Sales" value={metrics.todayRevenue} hint={`${metrics.todaySalesCount} invoices today`} currency tone="accent" />
        <MetricCard title="Weekly Revenue" value={metrics.weeklyRevenue} hint="Last 7 days performance" currency />
        <MetricCard title="Monthly Revenue" value={metrics.monthlyRevenue} hint="Rolling 30 days" currency />
        <MetricCard title="Stock Value" value={metrics.totalStockValue} hint={`${metrics.lowStockItems.length} low stock alerts`} currency tone="warning" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <ChartCard title="Sales Trend" description="Bar and line view for invoice volume and revenue">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip {...chartTooltipProps} />
                <Legend />
                <Bar dataKey="sales" fill="#20b07d" radius={[10, 10, 0, 0]} />
                <Line type="monotone" dataKey="invoices" stroke="#0f172a" strokeWidth={3} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <div className="panel p-5">
          <h3 className="text-lg font-semibold">Low Stock Alerts</h3>
          <div className="mt-4 space-y-3">
            {metrics.lowStockItems.map((item) => (
              <div key={item.id} className="panel-muted flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Threshold: {item.lowStockThreshold} {item.unit}
                  </p>
                </div>
                <span className="badge bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
                  {item.stock} {item.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <ChartCard title="Stock Movement" description="Recent received vs sold quantities from stock history">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stockMovement}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip {...chartTooltipProps} />
                <Legend />
                <Line type="monotone" dataKey="received" stroke="#20b07d" strokeWidth={3} />
                <Line type="monotone" dataKey="sold" stroke="#f97316" strokeWidth={3} />
                <Line type="monotone" dataKey="closing" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <div className="panel p-5">
          <h3 className="text-lg font-semibold">Recent Notifications</h3>
          <div className="mt-4 space-y-3">
            {notifications.slice(0, 6).map((notification) => (
              <div key={notification.id} className="panel-muted p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className={`badge ${notification.type === 'warning' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300' : 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300'}`}>
                    {notification.type}
                  </span>
                  <span className="text-xs text-slate-500">{formatDateTime(notification.date)}</span>
                </div>
                <p className="mt-3 text-sm">{notification.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'name', title: 'Best Selling Product' },
          { key: 'soldQty', title: 'Sold Qty' },
          { key: 'stock', title: 'Stock Left', render: (row) => `${row.stock} ${row.unit}` },
        ]}
        rows={performance.slice(0, 5)}
      />
    </div>
  );
}
