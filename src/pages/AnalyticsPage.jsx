import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartCard } from '../components/ChartCard';
import { chartTooltipProps } from '../components/chartTheme';
import { DataTable } from '../components/DataTable';
import { SectionTitle } from '../components/SectionTitle';
import { useStore } from '../store/useStore';
import { getProductPerformance } from '../utils/analytics';
import { formatCurrency } from '../utils/formatters';

export function AnalyticsPage() {
  const sales = useStore((state) => state.sales);
  const products = useStore((state) => state.products);
  const performance = getProductPerformance(sales, products);

  const bestSelling = performance.slice(0, 5);
  const slowMoving = [...performance].reverse().slice(0, 5);
  const chartData = performance.slice(0, 6).map((item) => ({
    name: item.name,
    value: item.soldQty,
  }));
  const revenueTrend = performance.slice(0, 6).map((item) => ({
    name: item.name,
    revenue: item.revenue,
  }));

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Analytics"
        title="Best sellers, slow movers, and profit outlook"
        description="Understand what is moving quickly, what is slowing down, and where your stock value is tied up."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Best Seller Mix" description="Share of sold quantities by top products">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={110} fill="#20b07d" label />
                <Tooltip {...chartTooltipProps} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Revenue by Product" description="Estimated revenue contribution from top movers">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip {...chartTooltipProps} />
                <Bar dataKey="revenue" fill="#f97316" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DataTable
          columns={[
            { key: 'name', title: 'Best Selling Product' },
            { key: 'soldQty', title: 'Sold Qty' },
            { key: 'revenue', title: 'Revenue', render: (row) => formatCurrency(row.revenue) },
          ]}
          rows={bestSelling}
        />

        <DataTable
          columns={[
            { key: 'name', title: 'Slow Moving Product' },
            { key: 'soldQty', title: 'Sold Qty' },
            { key: 'stock', title: 'Current Stock' },
          ]}
          rows={slowMoving}
        />
      </div>
    </div>
  );
}
