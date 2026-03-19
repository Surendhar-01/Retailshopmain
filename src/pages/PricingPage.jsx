import { useEffect, useMemo, useState } from 'react';
import { DataTable } from '../components/DataTable';
import { SectionTitle } from '../components/SectionTitle';
import { useStore } from '../store/useStore';
import { getCategoryOptions } from '../utils/analytics';
import { formatCurrency, formatDateTime } from '../utils/formatters';

export function PricingPage() {
  const products = useStore((state) => state.products);
  const priceHistory = useStore((state) => state.priceHistory);
  const updateProductPrice = useStore((state) => state.updateProductPrice);
  const [category, setCategory] = useState('all');
  const [editedPrices, setEditedPrices] = useState({});

  const categories = useMemo(() => getCategoryOptions(products), [products]);
  const filteredProducts = useMemo(
    () => products.filter((product) => category === 'all' || product.category === category),
    [products, category],
  );

  useEffect(() => {
    setEditedPrices(
      products.reduce((accumulator, product) => {
        accumulator[product.id] = product.price;
        return accumulator;
      }, {}),
    );
  }, [products]);

  const handleSavePrice = (productId) => {
    updateProductPrice(productId, editedPrices[productId]);
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Pricing"
        title="Current price board and price change tracker"
        description="Update live selling prices, keep history of increases or decreases, and preserve sold price per invoice."
      />

      <div className="panel flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
        <select className="input md:max-w-xs" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All categories</option>
          {categories.map((entry) => (
            <option key={entry} value={entry}>
              {entry}
            </option>
          ))}
        </select>
        <p className="text-sm text-slate-500">
          LocalStorage is active now. Firebase or Firestore can replace this persistence layer later.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((product) => (
          <div key={product.id} className="panel p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">{product.category}</p>
                <h3 className="text-lg font-semibold">{product.name}</h3>
              </div>
              <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                {product.unit}
              </span>
            </div>
            <p className="mt-4 text-3xl font-semibold">{formatCurrency(product.price)}</p>
            <div className="mt-4 flex gap-3">
              <input
                className="input"
                type="number"
                min="0"
                step="0.01"
                value={editedPrices[product.id] ?? product.price}
                onChange={(e) =>
                  setEditedPrices((current) => ({
                    ...current,
                    [product.id]: e.target.value,
                  }))
                }
              />
              <button
                className="btn-primary"
                type="button"
                onClick={() => handleSavePrice(product.id)}
              >
                Save
              </button>
            </div>
          </div>
        ))}
      </div>

      <DataTable
        columns={[
          { key: 'productId', title: 'Product', render: (row) => products.find((product) => product.id === row.productId)?.name || 'Unknown' },
          { key: 'date', title: 'Changed On', render: (row) => formatDateTime(row.date) },
          { key: 'oldPrice', title: 'Previous Price', render: (row) => formatCurrency(row.oldPrice) },
          { key: 'newPrice', title: 'Current Price', render: (row) => formatCurrency(row.newPrice) },
          {
            key: 'trend',
            title: 'Trend',
            render: (row) =>
              row.newPrice > row.oldPrice ? (
                <span className="badge bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">Increase</span>
              ) : (
                <span className="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">Decrease</span>
              ),
          },
        ]}
        rows={priceHistory}
      />
    </div>
  );
}
