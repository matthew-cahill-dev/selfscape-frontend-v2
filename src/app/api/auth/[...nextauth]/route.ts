// selfscape-frontend-v2/src/app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, profile }) {
      // ✅ make sure email is always present on the JWT payload
      if (user?.email) token.email = user.email;
      if (!token.email && profile && typeof (profile as any).email === "string") {
        token.email = (profile as any).email;
      }
      if (profile?.name) token.name = profile.name;
      if (profile && "picture" in profile) token.picture = (profile as any).picture;
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...(session.user ?? {}),
        email: (token.email as string) ?? "",
        name: token.name as string | undefined,
        image: token.picture as string | undefined,
      };
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

