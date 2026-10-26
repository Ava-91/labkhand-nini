# لبخند نینی (Labkhand Nini)

A baby and newborn e-commerce project.

## Stack
- **Frontend:** Next.js App Router, React, TypeScript, Tailwind CSS v4
- **Authentication:** NextAuth credentials provider
- **Backend / CMS:** Strapi
- **Database:** PostgreSQL

## Structure
```text
labkhand-nini/
├── frontend/   # Next.js storefront
├── backend/    # Strapi API and CMS
└── README.md
```

## Frontend setup
```powershell
Set-Location frontend
Copy-Item .env.example .env.local
npm install
npm run dev
```

Set `STRAPI_URL` and `AUTH_SECRET` in `frontend/.env.local`. When Strapi is configured, published products and storefront settings come from its API. The JSON files under `frontend/data/` provide local defaults and a sample catalogue only when Strapi has not been configured. If a configured Strapi instance is unavailable, the product list stays empty rather than showing stale sample products. Run `npm run typecheck`, `npm run lint`, and `npm run build` before release.

## Backend setup (Strapi + PostgreSQL)
Use Node.js 20–24 and a running PostgreSQL server. Create a local database named `labkhand_nini`, then run:

```powershell
Set-Location backend
Copy-Item .env.example .env
# Edit backend/.env locally: set DATABASE_PASSWORD and replace every placeholder secret.
npm install
npm run develop
```

Open http://127.0.0.1:1337/admin to create the first Strapi administrator. See [backend/README.md](backend/README.md) for API permissions and setup notes. Never commit `backend/.env` or real secrets.

## Managing storefront content in Strapi
- **Products:** create/edit Products, upload an image, set category, stock, price, discount, and featured status, then publish.
- **Categories:** manage the Categories collection and publish each category.
- **Logo, navbar, announcement, homepage and footer:** open the **Storefront Settings** single type, upload the logo, edit the fields, and publish. The `navLinks` and `promiseCards` fields are JSON arrays; each item has the structure shown in `frontend/data/site-settings.json`.
- **Public read access:** in **Settings → Users & Permissions Plugin → Roles → Public**, allow `find`/ `findOne` for Products, Categories, and Storefront Settings. Do not enable write permissions for the Public role.

The frontend intentionally keeps layout, styles, and interactive behavior in code. Content and merchandising copy should be changed through Strapi rather than editing React components.
