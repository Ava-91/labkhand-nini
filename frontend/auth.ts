import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const STRAPI_URL = process.env.STRAPI_URL?.replace(/\/$/, "");

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        // Do not send a request if the server or login details are missing.
        if (
          !STRAPI_URL ||
          typeof email !== "string" ||
          typeof password !== "string"
        ) {
          return null;
        }

        try {
          const response = await fetch(STRAPI_URL + "/api/auth/local", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              identifier: email,
              password,
            }),
            cache: "no-store",
          });

          if (!response.ok) {
            return null;
          }

          const result = await response.json();

          if (!result?.user || typeof result.jwt !== "string") {
            return null;
          }

          return {
            id: String(result.user.id),
            name: result.user.username ?? result.user.email,
            email: result.user.email,
            strapiToken: result.jwt,
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.strapiToken =
          "strapiToken" in user ? String(user.strapiToken) : "";
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.strapiToken = String(token.strapiToken ?? "");
      }

      return session;
    },
  },
});
