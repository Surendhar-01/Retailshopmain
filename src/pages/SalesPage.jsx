import { useMemo, useState } from 'react';
import { DataTable } from '../components/DataTable';
import { SectionTitle } from '../components/SectionTitle';
import { useStore } from '../store/useStore';
import { exportRowsAsCsv, printHtmlDocument } from '../utils/export';
import { formatCurrency, formatDate, formatDateTime } from '../utils/formatters';

export function SalesPage() {
  const sales = useStore((state) => state.sales);
  const products = useStore((state) => state.products);
  const [productId, setProductId] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const saleDate = new Date(sale.date);
      const productMatch = productId === 'all' || sale.items.some((item) => item.productId === productId);
      const fromMatch = !fromDate || saleDate >= new Date(fromDate);
      const toMatch = !toDate || saleDate <= new Date(`${toDate}T23:59:59`);
      return productMatch && fromMatch && toMatch;
    });
  }, [sales, productId, fromDate, toDate]);

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const itemWiseSales = filteredSales.flatMap((sale) =>
    sale.items.map((item) => ({
      id: `${sale.id}-${item.productId}`,
      invoiceNumber: sale.invoiceNumber,
      date: sale.date,
      name: item.name,
      quantity: item.quantity,
      soldPrice: item.price,
      lineTotal: item.lineTotal,
    })),
  );

  const exportSales = () => {
    exportRowsAsCsv(
      'sales-report.csv',
      filteredSales.map((sale) => ({
        invoiceNumber: sale.invoiceNumber,
        date: formatDateTime(sale.date),
        customerName: sale.customerName || 'Walk-in',
        total: sale.total,
        subtotal: sale.subtotal,
        gstAmount: sale.gstAmount,
      })),
    );
  };

  const printReport = () => {
    const rows = filteredSales
      .map(
        (sale) => `
          <tr>
            <td>${sale.invoiceNumber}</td>
            <td>${formatDateTime(sale.date)}</td>
            <td>${sale.customerName || 'Walk-in'}</td>
            <td>${formatCurrency(sale.total)}</td>
          </tr>`,
      )
      .join('');
    printHtmlDocument(
      'Sales Report',
      `
      <h1>Sales Report</h1>
      <p>Total Sales: ${formatCurrency(totalSales)}</p>
      <table>
        <thead><tr><th>Invoice</th><th>Date</th><th>Customer</th><th>Total</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`,
    );
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Sales Report"
        title="Daily, weekly, and monthly transaction history"
        description="Filter by date and product, then export to CSV for Excel or print to PDF from your browser."
        action={
          <div className="flex gap-3">
            <button className="btn-secondary" onClick={printReport} type="button">
              Print PDF
            </button>
            <button className="btn-primary" onClick={exportSales} type="button">
              Export Excel
            </button>
          </div>
        }
      />

      <div className="panel grid gap-4 p-5 md:grid-cols-4">
        <select className="input" value={productId} onChange={(e) => setProductId(e.target.value)}>
          <option value="all">All products</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        <input className="input" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        <input className="input" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        <div className="panel-muted flex items-center justify-center px-4 py-3 text-sm font-medium">
          Total: {formatCurrency(totalSales)}
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'invoiceNumber', title: 'Invoice' },
          { key: 'date', title: 'Date', render: (row) => formatDateTime(row.date) },
          { key: 'customerName', title: 'Customer', render: (row) => row.customerName || 'Walk-in' },
          { key: 'items', title: 'Items', render: (row) => row.items.map((item) => `${item.name} (${item.quantity})`).join(', ') },
          { key: 'total', title: 'Total', align: 'right', render: (row) => formatCurrency(row.total) },
        ]}
        rows={filteredSales}
      />

      <DataTable
        columns={[
          { key: 'date', title: 'Date', render: (row) => formatDate(row.date) },
          { key: 'invoiceNumber', title: 'Invoice' },
          { key: 'name', title: 'Product' },
          { key: 'quantity', title: 'Quantity' },
          { key: 'soldPrice', title: 'Sold Price', render: (row) => formatCurrency(row.soldPrice) },
          { key: 'lineTotal', title: 'Line Total', render: (row) => formatCurrency(row.lineTotal) },
        ]}
        rows={itemWiseSales}
        emptyText="No line items match this filter."
      />
    </div>
  );
}
