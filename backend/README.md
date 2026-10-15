# Labkhand Nini — Strapi backend

Strapi v5 CMS/API using PostgreSQL. Product fields match the storefront contract. The **Storefront Settings** single type controls the brand identity, uploaded logo, navigation links, announcement banner, SEO text, homepage copy and cards, and footer text.

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

## Content types
- **Products** — title, slug, description, price, discount, stock, featured, emoji, image, category.
- **Categories** — name, slug, description.
- **Storefront Settings** (single type) — brand name/tagline/logo, navigation links, announcement, SEO fields, homepage hero, category tiles, promise cards, calls to action, and footer.

The JSON fields `navLinks`, `categoryTiles`, and `promiseCards` are arrays. Their expected shape and initial example values are documented in `frontend/data/site-settings.json`.

## API and permissions
The API endpoints are `/api/products`, `/api/categories`, and `/api/site-setting`. In Strapi admin, open **Settings → Users & Permissions Plugin → Roles → Public** and allow only **find** and **findOne** for Products, Categories, and Storefront Settings if the storefront should read published content without authentication. Keep create, update, and delete restricted to administrators. Publish the single-type settings and each product/category entry for them to appear in the public API.
