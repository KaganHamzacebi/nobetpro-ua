import prisma from '@/libs/db/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt'
  },
  providers: [Google],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          ...user
        };
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    }
  },
  debug: process.env.NODE_ENV === 'development'
});
