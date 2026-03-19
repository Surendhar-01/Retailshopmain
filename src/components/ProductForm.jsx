import { useState } from 'react';

const initialForm = {
  name: '',
  category: 'Groceries',
  unit: 'kg',
  price: '',
  stock: '',
  openingStock: '',
  lowStockThreshold: '',
  image: '',
};

export function ProductForm({ onSubmit, initialValues, submitLabel = 'Save Product' }) {
  const [form, setForm] = useState(initialValues || initialForm);

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      openingStock: Number(form.openingStock || form.stock),
      lowStockThreshold: Number(form.lowStockThreshold || 10),
    });
    if (!initialValues) setForm(initialForm);
  };

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
      <input className="input" placeholder="Product name" value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
      <input className="input" placeholder="Category" value={form.category} onChange={(e) => updateField('category', e.target.value)} required />
      <select className="input" value={form.unit} onChange={(e) => updateField('unit', e.target.value)}>
        <option value="kg">kg</option>
        <option value="liter">liter</option>
        <option value="unit">unit</option>
        <option value="packet">packet</option>
      </select>
      <input className="input" type="number" min="0" step="0.01" placeholder="Current price" value={form.price} onChange={(e) => updateField('price', e.target.value)} required />
      <input className="input" type="number" min="0" step="0.01" placeholder="Current stock" value={form.stock} onChange={(e) => updateField('stock', e.target.value)} required />
      <input className="input" type="number" min="0" step="0.01" placeholder="Opening stock" value={form.openingStock} onChange={(e) => updateField('openingStock', e.target.value)} />
      <input className="input" type="number" min="0" step="0.01" placeholder="Low stock alert threshold" value={form.lowStockThreshold} onChange={(e) => updateField('lowStockThreshold', e.target.value)} />
      <input className="input" placeholder="Image URL (optional)" value={form.image} onChange={(e) => updateField('image', e.target.value)} />
      <div className="md:col-span-2">
        <button className="btn-primary" type="submit">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
