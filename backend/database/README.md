# SQL Backend Starter

This folder contains a MySQL 8+ starter schema for the retail shop app.

Files:

- `retail_shop_schema.sql`: creates the database, tables, indexes, views, and sample seed data

Import:

```bash
mysql -u root -p < backend/database/retail_shop_schema.sql
```

Main tables:

- `shop_profile`
- `users`
- `categories`
- `products`
- `price_history`
- `sales`
- `sale_items`
- `stock_history`
- `notifications`

Notes:

- Demo users are inserted with plain text passwords to match the current frontend demo. For production, replace `password_hash` values with real password hashes.
- The schema is designed so the frontend can migrate from `localStorage` to SQL-backed APIs without changing the business entities.
