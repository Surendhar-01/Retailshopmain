import { create } from 'zustand';
import { loadState, saveState } from '../services/storage';
import {
  seedNotifications,
  seedPriceHistory,
  seedProducts,
  seedSales,
  seedShop,
  seedStockHistory,
  seedUsers,
} from '../utils/seedData';

const createInitialState = () => ({
  shop: seedShop,
  users: seedUsers,
  currentUser: null,
  language: 'en',
  products: seedProducts,
  sales: seedSales,
  stockHistory: seedStockHistory,
  priceHistory: seedPriceHistory,
  notifications: seedNotifications,
});

const persisted = loadState();

const getSerializableState = (state) => ({
  shop: state.shop,
  users: state.users,
  currentUser: state.currentUser,
  language: state.language,
  products: state.products,
  sales: state.sales,
  stockHistory: state.stockHistory,
  priceHistory: state.priceHistory,
  notifications: state.notifications,
});

export const useStore = create((set, get) => ({
  ...(persisted || createInitialState()),
  login: ({ username, password }) => {
    const user = get().users.find(
      (entry) => entry.username === username && entry.password === password,
    );
    if (!user) return { ok: false, message: 'Invalid username or password' };
    set({ currentUser: user });
    return { ok: true };
  },
  logout: () => set({ currentUser: null }),
  setLanguage: (language) => set({ language }),
  addProduct: (product) =>
    set({
      products: [{ ...product, id: `p${Date.now()}` }, ...get().products],
    }),
  updateProduct: (productId, updates) =>
    set({
      products: get().products.map((product) =>
        product.id === productId ? { ...product, ...updates } : product,
      ),
    }),
  deleteProduct: (productId) =>
    set({
      products: get().products.filter((product) => product.id !== productId),
      priceHistory: get().priceHistory.filter((entry) => entry.productId !== productId),
      stockHistory: get().stockHistory.filter((entry) => entry.productId !== productId),
    }),
  updateProductPrice: (productId, newPrice) => {
    const product = get().products.find((entry) => entry.id === productId);
    if (!product || Number(product.price) === Number(newPrice)) return;
    set({
      products: get().products.map((entry) =>
        entry.id === productId ? { ...entry, price: Number(newPrice) } : entry,
      ),
      priceHistory: [
        {
          id: `ph${Date.now()}`,
          productId,
          oldPrice: Number(product.price),
          newPrice: Number(newPrice),
          date: new Date().toISOString(),
        },
        ...get().priceHistory,
      ],
    });
  },
  addRefillEntry: ({ productId, opening, received, sold }) => {
    const closing = Number(opening) + Number(received) - Number(sold);
    set({
      stockHistory: [
        {
          id: `sh${Date.now()}`,
          productId,
          opening: Number(opening),
          received: Number(received),
          sold: Number(sold),
          closing,
          date: new Date().toISOString(),
        },
        ...get().stockHistory,
      ],
      products: get().products.map((product) =>
        product.id === productId
          ? { ...product, openingStock: Number(opening), stock: closing }
          : product,
      ),
    });
  },
  createSale: ({ customerName, gstEnabled, items }) => {
    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const gstAmount = gstEnabled ? subtotal * 0.05 : 0;
    const total = subtotal + gstAmount;
    const invoiceNumber = `INV-${1000 + get().sales.length + 1}`;
    const sale = {
      id: `s${Date.now()}`,
      invoiceNumber,
      customerName,
      gstEnabled,
      subtotal,
      gstAmount,
      total,
      date: new Date().toISOString(),
      items,
    };

    const nextProducts = get().products.map((product) => {
      const matched = items.find((item) => item.productId === product.id);
      return matched ? { ...product, stock: product.stock - matched.quantity } : product;
    });

    const nextNotifications = [...get().notifications];
    nextProducts.forEach((product) => {
      if (product.stock <= product.lowStockThreshold) {
        nextNotifications.unshift({
          id: `n${Date.now()}-${product.id}`,
          type: 'warning',
          message: `${product.name} is low on stock (${product.stock} ${product.unit} left).`,
          date: new Date().toISOString(),
        });
      }
    });

    set({
      sales: [sale, ...get().sales],
      products: nextProducts,
      notifications: nextNotifications,
      stockHistory: [
        ...items.map((item) => {
          const product = get().products.find((entry) => entry.id === item.productId);
          const opening = product?.stock ?? 0;
          return {
            id: `sh${Date.now()}-${item.productId}`,
            productId: item.productId,
            date: new Date().toISOString(),
            opening,
            received: 0,
            sold: item.quantity,
            closing: opening - item.quantity,
            referenceSaleId: sale.id,
          };
        }),
        ...get().stockHistory,
      ],
    });

    return sale;
  },
  deleteSale: (saleId) => {
    const sale = get().sales.find((entry) => entry.id === saleId);
    if (!sale) return;

    const restoredProducts = get().products.map((product) => {
      const soldItems = sale.items.filter((item) => item.productId === product.id);
      if (!soldItems.length) return product;
      const restoredQty = soldItems.reduce((sum, item) => sum + Number(item.quantity), 0);
      return { ...product, stock: product.stock + restoredQty };
    });

    set({
      sales: get().sales.filter((entry) => entry.id !== saleId),
      products: restoredProducts,
      stockHistory: get().stockHistory.filter(
        (entry) => entry.referenceSaleId !== saleId && entry.id !== saleId,
      ),
      notifications: [
        {
          id: `n${Date.now()}`,
          type: 'info',
          message: `Invoice ${sale.invoiceNumber} was deleted and stock was restored.`,
          date: new Date().toISOString(),
        },
        ...get().notifications,
      ],
    });
  },
}));

useStore.subscribe((state) => {
  saveState(getSerializableState(state));
});
