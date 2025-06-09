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
    error: '/auth/error', // Redirect to a dedicated error page
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Prevent infinite redirect loops
      if (url.includes('callbackUrl') && url.includes('error=OAuth')) {
        return baseUrl;
      }
      
      // Handle Render.com URLs
      if (baseUrl.includes('.onrender.com')) {
        return baseUrl;
      }
      
      // If it's a relative URL, prepend the baseUrl
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      
      // If the URL is on the same origin, allow it
      try {
        const urlObj = new URL(url);
        const baseUrlObj = new URL(baseUrl);
        if (urlObj.origin === baseUrlObj.origin) {
          return url;
        }
      } catch (error) {
        console.error('Redirect URL parsing error:', error);
      }
      
      // Default to baseUrl to prevent external redirects
      return baseUrl;
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