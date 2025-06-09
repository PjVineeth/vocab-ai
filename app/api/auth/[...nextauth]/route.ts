import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile",
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  pages: {
    signIn: '/',
    error: '/', // Redirect to home page on error
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Use your server URL as baseUrl if not set
      const serverUrl = process.env.NEXTAUTH_URL || baseUrl;
      const actualBaseUrl = baseUrl || serverUrl;
      
      // Ensures that redirects stay within the app
      if (url.startsWith("/")) return `${actualBaseUrl}${url}`;
      // Allow callback to same origin
      if (new URL(url).origin === actualBaseUrl) return url;
      return actualBaseUrl;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        // Ensure the image is included in the session
        if (token.picture) {
          session.user.image = token.picture as string;
        }
      }
      return session;
    },
    async jwt({ token, account, profile }) {
      if (profile && 'picture' in profile && typeof profile.picture === 'string') {
        token.picture = profile.picture;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST }; 