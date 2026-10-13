# لبخند نینی — Frontend

Next.js App Router storefront using the same basic structure and NextAuth + Strapi approach as [Ava-91/nextjsshop](https://github.com/Ava-91/nextjsshop), enhanced for baby products.

## Run locally
1. Copy `.env.example` to `.env.local`.
2. Set `STRAPI_URL` and a long random `AUTH_SECRET`.
3. Run `npm install`, then `npm run dev`.
4. Open http://localhost:3000.

Scripts: `npm run dev`, `npm run typecheck`, `npm run lint`, `npm run build`.

Structure: `app/` for routes/UI, `lib/products.ts` for product model/sample data/Strapi mapping, `lib/strapi.ts` for CMS requests, and `auth.ts` for NextAuth credentials auth. A sample catalogue keeps UI work possible before Strapi is running.
