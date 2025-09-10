// src/lib/auth.ts
import { AuthOptions, User } from "next-auth"; // Removido Session que não é usado diretamente aqui
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ... (as declarações de module continuam as mesmas) ...
declare module "next-auth" {
  interface User {
    token?: string;
    teamId?: string | null;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      teamId?: string | null;
    };
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    teamId?: string | null;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    // ... Seu CredentialsProvider continua o mesmo
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const response = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const data = await response.json();

        if (response.ok && data.user) {
          return { ...data.user, token: data.token };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    // CORREÇÃO: Adicionado 'trigger' e 'session' para lidar com atualizações
    async jwt({ token, user, trigger, session }) {
      // No login inicial
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.accessToken = user.token;
        token.teamId = user.teamId;
      }

      // Quando a função `update` é chamada no cliente
      if (trigger === "update" && session?.teamId) {
        token.teamId = session.teamId;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.teamId = token.teamId as string;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
};
