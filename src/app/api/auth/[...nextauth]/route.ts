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
    async jwt({ token, profile }) {
      if (profile?.name) token.name = profile.name;
      if (profile && "picture" in profile) token.picture = (profile as any).picture;
      return token;
    },
    async session({ session, token }) {
      // ✅ Safe assignment, avoids TS error "session.user is possibly undefined"
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
