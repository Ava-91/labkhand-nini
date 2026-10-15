# Labkhand Nini — Strapi backend

Strapi v5 CMS/API using PostgreSQL. The Product content type matches the storefront contract in `frontend/lib/products.ts`: `title`, `slug`, `description`, `price`, `discount`, `stock`, `featured`, `emoji`, `image`, and `category`.

## Requirements
- Node.js 20–24
- PostgreSQL running locally
- A PostgreSQL database named `labkhand_nini`

## Setup (PowerShell)
```powershell
Set-Location backend
Copy-Item .env.example .env
# Edit .env locally: set your PostgreSQL password and generate unique secrets.
npm install
npm run develop
```

Open http://127.0.0.1:1337/admin and create the first administrator. Never commit the populated `.env` file.

## API and permissions
The API routes are `/api/products` and `/api/categories`. In Strapi admin, open **Settings → Users & Permissions Plugin → Roles → Public** and grant only **find** and **findOne** for Products and Categories if the storefront should read published catalogue data without authentication. Keep create, update, and delete restricted to authenticated administrators.
