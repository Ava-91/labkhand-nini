import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
const STRAPI_URL = process.env.STRAPI_URL?.replace(/\/$/, "");
export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  providers: [Credentials({ credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } }, async authorize(credentials) {
    if (!STRAPI_URL || typeof credentials?.email !== "string" || typeof credentials?.password !== "string") return null;
    try {
      const response = await fetch(STRAPI_URL + "/api/auth/local", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ identifier: credentials.email, password: credentials.password }), cache: "no-store" });
      if (!response.ok) return null;
      const data = await response.json();
      if (!data?.user || typeof data?.jwt !== "string") return null;
      return { id: String(data.user.id), name: data.user.username ?? data.user.email, email: data.user.email, strapiToken: data.jwt };
    } catch { return null; }
  }})],
  callbacks: {
    async jwt({ token, user }) { if (user) { token.id = user.id; token.strapiToken = "strapiToken" in user ? String(user.strapiToken) : ""; } return token; },
    async session({ session, token }) { if (session.user) { session.user.id = String(token.id ?? ""); session.user.strapiToken = String(token.strapiToken ?? ""); } return session; },
  },
});
