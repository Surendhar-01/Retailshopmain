import { Plus, Printer, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { SectionTitle } from '../components/SectionTitle';
import { useStore } from '../store/useStore';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import { printInvoice } from '../utils/invoice';

export function BillingPage() {
  const products = useStore((state) => state.products);
  const createSale = useStore((state) => state.createSale);
  const deleteSale = useStore((state) => state.deleteSale);
  const shop = useStore((state) => state.shop);
  const sales = useStore((state) => state.sales);
  const [customerName, setCustomerName] = useState('');
  const [gstEnabled, setGstEnabled] = useState(true);
  const [items, setItems] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [lastBill, setLastBill] = useState(sales[0] || null);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedProductId),
    [products, selectedProductId],
  );

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const gstAmount = gstEnabled ? subtotal * 0.05 : 0;
  const finalTotal = subtotal + gstAmount;

  const addItem = () => {
    if (!selectedProduct || Number(quantity) <= 0) return;
    const qty = Number(quantity);
    const lineTotal = qty * selectedProduct.price;
    setItems((current) => [
      ...current,
      {
        productId: selectedProduct.id,
        name: selectedProduct.name,
        unit: selectedProduct.unit,
        quantity: qty,
        price: selectedProduct.price,
        lineTotal,
      },
    ]);
    setQuantity(1);
  };

  const removeItem = (index) => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));

  const handleCheckout = () => {
    if (!items.length) return;
    const sale = createSale({ customerName, gstEnabled, items });
    setLastBill(sale);
    setItems([]);
    setCustomerName('');
  };

  const handleDeleteBill = (saleId) => {
    const billToDelete = sales.find((sale) => sale.id === saleId);
    deleteSale(saleId);
    if (lastBill?.id === saleId) {
      const replacementBill = sales.find((sale) => sale.id !== saleId) || null;
      setLastBill(replacementBill);
    }
    if (billToDelete && items.length === 0) {
      setCustomerName('');
    }
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Billing"
        title="POS-style invoice billing"
        description="Create customer bills with live pricing, optional GST, and printable invoices. Every sale stores the exact price used."
        action={
          lastBill ? (
            <button className="btn-secondary" type="button" onClick={() => printInvoice({ bill: lastBill, shop })}>
              <Printer className="mr-2 h-4 w-4" />
              Print last invoice
            </button>
          ) : null
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="panel p-5">
          <h3 className="text-lg font-semibold">Create Bill</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <input className="input" placeholder="Customer name (optional)" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            <label className="panel-muted flex items-center justify-between px-4 py-3 text-sm">
              Apply GST (5%)
              <input type="checkbox" checked={gstEnabled} onChange={(e) => setGstEnabled(e.target.checked)} />
            </label>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-[1fr_0.4fr_auto]">
            <select className="input" value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)}>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({formatCurrency(product.price)})
                </option>
              ))}
            </select>
            <input className="input" type="number" min="0.1" step="0.1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            <button className="btn-primary" type="button" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              Add item
            </button>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                  <th className="pb-3">Item</th>
                  <th className="pb-3">Qty</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {items.map((item, index) => (
                  <tr key={`${item.productId}-${index}`}>
                    <td className="py-3">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.unit}</p>
                    </td>
                    <td className="py-3">{item.quantity}</td>
                    <td className="py-3">{formatCurrency(item.price)}</td>
                    <td className="py-3">{formatCurrency(item.lineTotal)}</td>
                    <td className="py-3 text-right">
                      <button className="text-rose-500" type="button" onClick={() => removeItem(index)}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {!items.length && (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-sm text-slate-500">
                      Add products to start building an invoice.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col gap-3 rounded-3xl bg-slate-950 p-5 text-white md:ml-auto md:max-w-sm">
            <div className="flex justify-between text-sm text-slate-300">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-300">
              <span>GST</span>
              <span>{formatCurrency(gstAmount)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Final Total</span>
              <span>{formatCurrency(finalTotal)}</span>
            </div>
            <button className="btn-primary w-full" type="button" onClick={handleCheckout}>
              Save bill
            </button>
          </div>
        </div>

        <div className="panel p-5">
          <h3 className="text-lg font-semibold">Invoice Preview</h3>
          <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
            <div className="text-center">
              <h4 className="text-2xl font-bold">{shop.name}</h4>
              <p className="mt-1 text-sm">{shop.address}</p>
              <p className="text-sm">GSTIN: {shop.gstin}</p>
            </div>
            <div className="mt-5 flex justify-between text-sm">
              <span>Customer: {customerName || 'Walk-in Customer'}</span>
              <span>{formatDateTime(new Date().toISOString())}</span>
            </div>
            <div className="mt-6 space-y-3">
              {items.map((item, index) => (
                <div key={`${item.productId}-preview-${index}`} className="flex justify-between border-b border-dashed border-slate-300 pb-3 text-sm dark:border-slate-700">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>{formatCurrency(item.lineTotal)}</span>
                </div>
              ))}
              {!items.length && <p className="text-sm text-slate-500">Invoice items will appear here.</p>}
            </div>
            <div className="mt-6 space-y-2 border-t border-slate-300 pt-4 text-sm dark:border-slate-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST</span>
                <span>{formatCurrency(gstAmount)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(finalTotal)}</span>
              </div>
            </div>
          </div>

          {lastBill && (
            <div className="mt-5 panel-muted p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Last Saved Invoice</p>
                  <h4 className="mt-2 font-semibold">{lastBill.invoiceNumber}</h4>
                  <p className="mt-1 text-sm text-slate-500">{formatCurrency(lastBill.total)}</p>
                </div>
                <button
                  className="rounded-2xl bg-rose-500 px-3 py-2 text-sm font-semibold text-white"
                  type="button"
                  onClick={() => handleDeleteBill(lastBill.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          )}

          <div className="mt-5">
            <h3 className="text-lg font-semibold">Recent Saved Bills</h3>
            <div className="mt-4 space-y-3">
              {sales.slice(0, 5).map((sale) => (
                <div key={sale.id} className="panel-muted flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="font-medium">{sale.invoiceNumber}</p>
                    <p className="text-sm text-slate-500">
                      {sale.customerName || 'Walk-in Customer'} • {formatDateTime(sale.date)}
                    </p>
                    <p className="mt-1 text-sm">{formatCurrency(sale.total)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="btn-secondary"
                      type="button"
                      onClick={() => setLastBill(sale)}
                    >
                      View
                    </button>
                    <button
                      className="rounded-2xl bg-rose-500 px-3 py-2 text-sm font-semibold text-white"
                      type="button"
                      onClick={() => handleDeleteBill(sale.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
