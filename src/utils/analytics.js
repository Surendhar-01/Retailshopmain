const startOfDay = (date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const diffDays = (date, compare) =>
  Math.floor((startOfDay(compare) - startOfDay(date)) / (1000 * 60 * 60 * 24));

export const getDashboardMetrics = ({ products, sales }) => {
  const now = new Date();
  const todaySales = sales.filter((sale) => diffDays(new Date(sale.date), now) === 0);
  const weeklySales = sales.filter((sale) => diffDays(new Date(sale.date), now) <= 6);
  const monthlySales = sales.filter((sale) => diffDays(new Date(sale.date), now) <= 29);

  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const totalStockValue = products.reduce((sum, product) => sum + product.stock * product.price, 0);
  const lowStockItems = products.filter((product) => product.stock <= product.lowStockThreshold);

  return {
    totalStock,
    totalStockValue,
    lowStockItems,
    todayRevenue: todaySales.reduce((sum, sale) => sum + sale.total, 0),
    weeklyRevenue: weeklySales.reduce((sum, sale) => sum + sale.total, 0),
    monthlyRevenue: monthlySales.reduce((sum, sale) => sum + sale.total, 0),
    todaySalesCount: todaySales.length,
  };
};

export const getSalesTrend = (sales) => {
  const map = new Map();
  sales.forEach((sale) => {
    const date = new Date(sale.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    const current = map.get(date) || { date, sales: 0, invoices: 0 };
    current.sales += sale.total;
    current.invoices += 1;
    map.set(date, current);
  });
  return [...map.values()].slice(-7);
};

export const getStockMovement = (stockHistory, products) =>
  stockHistory.slice(0, 8).map((entry) => ({
    date: new Date(entry.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    product: products.find((product) => product.id === entry.productId)?.name || 'Unknown',
    closing: entry.closing,
    received: entry.received,
    sold: entry.sold,
  }));

export const getProductPerformance = (sales, products) => {
  const totals = new Map();
  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      totals.set(item.productId, (totals.get(item.productId) || 0) + item.quantity);
    });
  });

  return products
    .map((product) => ({
      ...product,
      soldQty: totals.get(product.id) || 0,
      revenue: (totals.get(product.id) || 0) * product.price,
    }))
    .sort((a, b) => b.soldQty - a.soldQty);
};

export const getCategoryOptions = (products) => [...new Set(products.map((product) => product.category))];
