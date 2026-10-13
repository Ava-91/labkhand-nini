# لبخند نینی (Labkhand Nini)

A baby and newborn e-commerce project.

## Stack
- **Frontend:** Next.js App Router, React, TypeScript, Tailwind CSS v4
- **Authentication:** NextAuth credentials provider
- **Backend / CMS:** Strapi
- **Database:** PostgreSQL (managed by backend)

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
Set `STRAPI_URL` and `AUTH_SECRET` in `frontend/.env.local`. The storefront has sample data before Strapi is ready; once configured, it reads `/api/products?populate=*`. Run `npm run typecheck`, `npm run lint`, and `npm run build` before release.

The storefront product catalogue, search, category filters, sorting, featured products, and product details live in `frontend/app` and `frontend/lib/products.ts`. Coordinate schema changes with the Strapi/PostgreSQL teammate. Frontend structure is inspired by [Ava-91/nextjsshop](https://github.com/Ava-91/nextjsshop).
