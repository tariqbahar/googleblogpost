// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';

import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/libs/mongoClient';
import connectDB from '@/libs/mongodb';
import User from '@/models/User';

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('🔑 Credentials login attempt');

        await connectDB();

        const email = credentials.email?.toLowerCase().trim();
        const password = credentials.password;

        console.log('📥 Email:', email);
        console.log('📥 Password input:', password);

        const user = await User.findOne({ email });

        if (!user) {
          console.log('❌ No user found');
          throw new Error('Invalid email or password');
        }

        if (!user.password) {
          console.log('❌ User has no password (probably OAuth)');
          throw new Error('Use your social login');
        }

        console.log('🔒 Password hash from DB:', user.password);

        const isValid = await user.comparePassword(password);

        console.log('✅ Password match result:', isValid);

        if (!isValid) {
          throw new Error('Invalid email or password');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),

    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],

  pages: {
    signIn: '/auth',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
