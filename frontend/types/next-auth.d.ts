import type { DefaultSession } from "next-auth";
declare module "next-auth" { interface Session { user: { id: string; strapiToken: string } & DefaultSession["user"]; } interface User { strapiToken: string; } }
declare module "@auth/core/jwt" { interface JWT { id?: string; strapiToken?: string; } }
