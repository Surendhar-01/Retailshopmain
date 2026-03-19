const today = new Date();
const daysAgo = (days) => {
  const date = new Date(today);
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

export const seedShop = {
  name: 'Annapoorna Retail Mart',
  gstin: '33ABCDE1234F1Z5',
  address: '12 Market Street, Coimbatore, Tamil Nadu',
};

export const seedUsers = [
  { id: 'u1', name: 'Admin User', username: 'admin', password: 'admin123', role: 'admin' },
  { id: 'u2', name: 'Staff User', username: 'staff', password: 'staff123', role: 'staff' },
];

export const seedProducts = [
  { id: 'p1', name: 'Groundnut Oil', category: 'Oil', unit: 'liter', price: 182, stock: 72, openingStock: 90, lowStockThreshold: 20, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80' },
  { id: 'p2', name: 'Sunflower Oil', category: 'Oil', unit: 'liter', price: 168, stock: 48, openingStock: 60, lowStockThreshold: 18, image: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=400&q=80' },
  { id: 'p3', name: 'Raw Rice', category: 'Groceries', unit: 'kg', price: 58, stock: 140, openingStock: 200, lowStockThreshold: 40 },
  { id: 'p4', name: 'Toor Dal', category: 'Groceries', unit: 'kg', price: 122, stock: 34, openingStock: 60, lowStockThreshold: 15 },
  { id: 'p5', name: 'Sugar', category: 'Groceries', unit: 'kg', price: 46, stock: 65, openingStock: 90, lowStockThreshold: 20 },
  { id: 'p6', name: 'Wheat Flour', category: 'Groceries', unit: 'kg', price: 42, stock: 54, openingStock: 75, lowStockThreshold: 20 },
];

export const seedPriceHistory = [
  { id: 'ph1', productId: 'p1', oldPrice: 175, newPrice: 182, date: daysAgo(14) },
  { id: 'ph2', productId: 'p2', oldPrice: 172, newPrice: 168, date: daysAgo(7) },
  { id: 'ph3', productId: 'p4', oldPrice: 118, newPrice: 122, date: daysAgo(5) },
];

export const seedStockHistory = [
  { id: 'sh1', productId: 'p1', date: daysAgo(6), opening: 60, received: 30, sold: 18, closing: 72 },
  { id: 'sh2', productId: 'p2', date: daysAgo(6), opening: 40, received: 20, sold: 12, closing: 48 },
  { id: 'sh3', productId: 'p3', date: daysAgo(5), opening: 150, received: 50, sold: 60, closing: 140 },
  { id: 'sh4', productId: 'p4', date: daysAgo(3), opening: 22, received: 20, sold: 8, closing: 34 },
];

export const seedSales = [
  {
    id: 's1',
    invoiceNumber: 'INV-1001',
    customerName: 'Manikandan',
    date: daysAgo(0),
    gstEnabled: true,
    subtotal: 1256,
    gstAmount: 62.8,
    total: 1318.8,
    items: [
      { productId: 'p1', name: 'Groundnut Oil', quantity: 4, unit: 'liter', price: 182, lineTotal: 728 },
      { productId: 'p4', name: 'Toor Dal', quantity: 2, unit: 'kg', price: 122, lineTotal: 244 },
      { productId: 'p5', name: 'Sugar', quantity: 6.2, unit: 'kg', price: 46, lineTotal: 285.2 },
    ],
  },
  {
    id: 's2',
    invoiceNumber: 'INV-1002',
    customerName: '',
    date: daysAgo(1),
    gstEnabled: false,
    subtotal: 986,
    gstAmount: 0,
    total: 986,
    items: [
      { productId: 'p3', name: 'Raw Rice', quantity: 10, unit: 'kg', price: 58, lineTotal: 580 },
      { productId: 'p6', name: 'Wheat Flour', quantity: 7, unit: 'kg', price: 42, lineTotal: 294 },
      { productId: 'p2', name: 'Sunflower Oil', quantity: 1, unit: 'liter', price: 168, lineTotal: 168 },
    ],
  },
  {
    id: 's3',
    invoiceNumber: 'INV-1003',
    customerName: 'Lakshmi Stores',
    date: daysAgo(4),
    gstEnabled: true,
    subtotal: 2170,
    gstAmount: 108.5,
    total: 2278.5,
    items: [
      { productId: 'p1', name: 'Groundnut Oil', quantity: 5, unit: 'liter', price: 182, lineTotal: 910 },
      { productId: 'p3', name: 'Raw Rice', quantity: 15, unit: 'kg', price: 58, lineTotal: 870 },
      { productId: 'p4', name: 'Toor Dal', quantity: 3, unit: 'kg', price: 122, lineTotal: 366 },
      { productId: 'p5', name: 'Sugar', quantity: 0.5, unit: 'kg', price: 46, lineTotal: 23 },
    ],
  },
];

export const seedNotifications = [
  { id: 'n1', type: 'warning', message: 'Toor Dal is below refill threshold.', date: daysAgo(0) },
  { id: 'n2', type: 'info', message: 'Weekly refill due tomorrow for oil section.', date: daysAgo(0) },
];
