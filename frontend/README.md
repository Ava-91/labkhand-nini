# لبخند نینی — Frontend

A beginner-friendly first demo of the لبخند نینی shop, built with Next.js, React, TypeScript, Tailwind CSS, and optional Strapi data.

## Run locally

1. Copy `.env.example` to `.env.local`.
2. Set `STRAPI_URL` and a long random `AUTH_SECRET`.
3. Run `npm install`, then `npm run dev`.
4. Open http://localhost:3000.

## Useful commands

- `npm run dev` — start the development server.
- `npm run typecheck` — check TypeScript.
- `npm run lint` — run ESLint.
- `npm run build` — create a production build.

## Simple project map

- `app/page.tsx` — homepage.
- `app/products/page.tsx` — product list.
- `app/products/[slug]/page.tsx` — one product's details.
- `app/components/ProductCatalog.tsx` — product cards, search, category filter, and sorting.
- `app/components/Navbar.tsx` — site navigation.
- `app/login/` and `app/register/` — account forms.
- `app/dashboard/page.tsx` — signed-in user's dashboard.
- `app/tailwind.css` — Tailwind entry point and local Persian font definitions.
- `lib/products.ts` — product data and Strapi mapping.
- `lib/strapi.ts` — requests to Strapi.
- `lib/site-settings.ts` — website text and settings.
- `auth.ts` — NextAuth credentials authentication.

## Styling

Use Tailwind utility classes directly in each component's `className`, such as `rounded-xl`, `bg-white`, `p-4`, and `text-rose-700`. This demo intentionally avoids a large custom stylesheet so the layout is easier to read and change.

The app can show sample catalogue data before Strapi is running.
