# Retail Shop Stock & Sales Management System

A modern React + Vite + Tailwind CSS dashboard for a small retail/oil/grocery shop workflow with:

- Dashboard overview with charts, KPIs, low-stock alerts, and recent activity
- Billing system with invoice preview, GST toggle, printable invoice, and saved transactions
- Sales report with filters and CSV export for Excel
- Stock management with weekly refill tracker and live stock sheet
- Pricing board with price history tracking
- Product CRUD
- Analytics dashboard for best sellers, slow movers, and revenue insight
- Simple role-based login (`admin` and `staff`)
- Dark mode and local persistence

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Zustand, Recharts
- Backend stub: Node.js + Express
- Current persistence: `localStorage`
- Production-ready alternatives:
  - MySQL / MariaDB via the included SQL schema
  - Firebase Auth + Firestore
  - Node.js + Express + MongoDB

## Demo Credentials

- Admin: `admin` / `admin123`
- Staff: `staff` / `staff123`

## Run Steps

1. Install dependencies:

```bash
npm install
```

2. Start the frontend:

```bash
npm run dev
```

3. Optional: start the backend stub:

```bash
npm run server
```

4. Open the Vite URL shown in your terminal, usually `http://localhost:5173`

## SQL Backend

- SQL schema file: `backend/database/retail_shop_schema.sql`
- MySQL import example:

```bash
mysql -u root -p < backend/database/retail_shop_schema.sql
```

## Notes

- Reports export to CSV, which opens in Excel.
- PDF output uses the browser print dialog, so you can save invoices/reports as PDF.
- Data is seeded automatically on first load and then persisted in localStorage.
- For mobile app reuse, this frontend can be adapted into React Native or wrapped in Capacitor.

## Folder Structure

```text
backend/
src/
  components/
  pages/
  services/
  store/
  utils/
```
