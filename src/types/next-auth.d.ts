// selfscape-frontend-v2/src/types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      email: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    email?: string;
    picture?: string;
    name?: string;
  }
}
