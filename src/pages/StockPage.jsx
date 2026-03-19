import { useMemo, useState } from 'react';
import { DataTable } from '../components/DataTable';
import { SectionTitle } from '../components/SectionTitle';
import { useStore } from '../store/useStore';
import { formatDateTime } from '../utils/formatters';

export function StockPage() {
  const products = useStore((state) => state.products);
  const stockHistory = useStore((state) => state.stockHistory);
  const addRefillEntry = useStore((state) => state.addRefillEntry);
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [refillForm, setRefillForm] = useState({ opening: '', received: '', sold: '' });
  const [search, setSearch] = useState('');

  const filteredProducts = useMemo(
    () => products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase())),
    [products, search],
  );

  const handleRefillSubmit = (event) => {
    event.preventDefault();
    addRefillEntry({ productId: selectedProductId, ...refillForm });
    setRefillForm({ opening: '', received: '', sold: '' });
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Stock Management"
        title="Weekly refill tracker and live stock sheet"
        description="Record opening stock, received quantity, sales deduction, and closing stock exactly like a manual shop register."
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form className="panel space-y-4 p-5" onSubmit={handleRefillSubmit}>
          <h3 className="text-lg font-semibold">Add Weekly Refill Entry</h3>
          <select className="input" value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)}>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
          <input className="input" type="number" min="0" step="0.1" placeholder="Opening stock" value={refillForm.opening} onChange={(e) => setRefillForm((current) => ({ ...current, opening: e.target.value }))} required />
          <input className="input" type="number" min="0" step="0.1" placeholder="Received stock" value={refillForm.received} onChange={(e) => setRefillForm((current) => ({ ...current, received: e.target.value }))} required />
          <input className="input" type="number" min="0" step="0.1" placeholder="Sold quantity" value={refillForm.sold} onChange={(e) => setRefillForm((current) => ({ ...current, sold: e.target.value }))} required />
          <button className="btn-primary" type="submit">
            Save stock entry
          </button>
        </form>

        <div className="panel p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h3 className="text-lg font-semibold">Current Stock Report</h3>
            <input className="input md:max-w-xs" placeholder="Search item" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <div key={product.id} className="panel-muted p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-slate-500">{product.category}</p>
                  </div>
                  <span className={`badge ${product.stock <= product.lowStockThreshold ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300' : 'bg-brand-100 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'}`}>
                    {product.stock} {product.unit}
                  </span>
                </div>
                <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between"><span>Opening</span><span>{product.openingStock}</span></div>
                  <div className="flex justify-between"><span>Low stock limit</span><span>{product.lowStockThreshold}</span></div>
                  <div className="flex justify-between"><span>Current price</span><span>Rs. {product.price}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'productId', title: 'Product', render: (row) => products.find((product) => product.id === row.productId)?.name || 'Unknown' },
          { key: 'date', title: 'Date', render: (row) => formatDateTime(row.date) },
          { key: 'opening', title: 'Opening' },
          { key: 'received', title: 'Received' },
          { key: 'sold', title: 'Sold' },
          { key: 'closing', title: 'Closing' },
        ]}
        rows={stockHistory}
      />
    </div>
  );
}
