import { useState } from 'react';
import { DataTable } from '../components/DataTable';
import { ProductForm } from '../components/ProductForm';
import { SectionTitle } from '../components/SectionTitle';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../utils/formatters';

export function ProductsPage() {
  const products = useStore((state) => state.products);
  const addProduct = useStore((state) => state.addProduct);
  const deleteProduct = useStore((state) => state.deleteProduct);
  const updateProduct = useStore((state) => state.updateProduct);
  const [editingId, setEditingId] = useState(null);

  const editingProduct = products.find((product) => product.id === editingId);

  const handleUpdate = (values) => {
    updateProduct(editingId, values);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Products"
        title="Maintain your sellable catalog"
        description="Create and manage oil, grocery, and unit-based products with stock, price, category, unit, and optional image."
      />

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="panel p-5">
          <h3 className="text-lg font-semibold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
          <div className="mt-5">
            <ProductForm initialValues={editingProduct} onSubmit={editingProduct ? handleUpdate : addProduct} submitLabel={editingProduct ? 'Update Product' : 'Add Product'} />
          </div>
        </div>

        <DataTable
          columns={[
            { key: 'name', title: 'Product' },
            { key: 'category', title: 'Category' },
            { key: 'unit', title: 'Unit' },
            { key: 'price', title: 'Price', render: (row) => formatCurrency(row.price) },
            { key: 'stock', title: 'Stock', render: (row) => `${row.stock} ${row.unit}` },
            {
              key: 'actions',
              title: 'Actions',
              render: (row) => (
                <div className="flex gap-2">
                  <button className="btn-secondary" type="button" onClick={() => setEditingId(row.id)}>
                    Edit
                  </button>
                  <button className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white" type="button" onClick={() => deleteProduct(row.id)}>
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
          rows={products}
        />
      </div>
    </div>
  );
}
