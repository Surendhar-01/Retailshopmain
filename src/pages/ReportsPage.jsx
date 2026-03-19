import { useMemo } from 'react';
import { DataTable } from '../components/DataTable';
import { MetricCard } from '../components/MetricCard';
import { SectionTitle } from '../components/SectionTitle';
import { useStore } from '../store/useStore';
import { exportRowsAsCsv, printHtmlDocument } from '../utils/export';
import { formatCurrency, formatDateTime } from '../utils/formatters';

export function ReportsPage() {
  const sales = useStore((state) => state.sales);
  const products = useStore((state) => state.products);

  const reportRows = useMemo(
    () =>
      products.map((product) => {
        const soldQuantity = sales.reduce((total, sale) => {
          const matchingItems = sale.items.filter((item) => item.productId === product.id);
          return total + matchingItems.reduce((sum, item) => sum + item.quantity, 0);
        }, 0);
        return {
          id: product.id,
          name: product.name,
          category: product.category,
          openingStock: product.openingStock,
          soldQuantity,
          remainingStock: product.stock,
          stockValue: product.stock * product.price,
        };
      }),
    [products, sales],
  );

  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalSoldItems = reportRows.reduce((sum, row) => sum + row.soldQuantity, 0);

  const exportStockReport = () => {
    exportRowsAsCsv('stock-report.csv', reportRows);
  };

  const printStockReport = () => {
    const rows = reportRows
      .map(
        (row) => `
          <tr>
            <td>${row.name}</td>
            <td>${row.category}</td>
            <td>${row.openingStock}</td>
            <td>${row.soldQuantity}</td>
            <td>${row.remainingStock}</td>
          </tr>`,
      )
      .join('');
    printHtmlDocument(
      'Stock Report',
      `
      <h1>Stock Report</h1>
      <p>Generated: ${formatDateTime(new Date().toISOString())}</p>
      <table>
        <thead><tr><th>Item</th><th>Category</th><th>Opening</th><th>Sold</th><th>Remaining</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`,
    );
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Reports"
        title="Printable stock and sales summaries"
        description="Use these reports for daily review, weekly refill planning, and monthly business tracking."
        action={
          <div className="flex gap-3">
            <button className="btn-secondary" type="button" onClick={printStockReport}>
              Print report
            </button>
            <button className="btn-primary" type="button" onClick={exportStockReport}>
              Export Excel
            </button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Gross Sales" value={totalSales} currency />
        <MetricCard title="Items Sold" value={totalSoldItems} />
        <MetricCard title="Products Tracked" value={products.length} />
      </div>

      <DataTable
        columns={[
          { key: 'name', title: 'Item' },
          { key: 'category', title: 'Category' },
          { key: 'openingStock', title: 'Opening Stock' },
          { key: 'soldQuantity', title: 'Sold Quantity' },
          { key: 'remainingStock', title: 'Remaining Stock' },
          { key: 'stockValue', title: 'Current Stock Value', render: (row) => formatCurrency(row.stockValue) },
        ]}
        rows={reportRows}
      />
    </div>
  );
}
