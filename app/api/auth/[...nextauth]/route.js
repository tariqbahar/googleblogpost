// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';

import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/libs/mongoClient'; // for NextAuth adapter
import connectDB from '@/libs/mongodb';         // for mongoose connection
import User from '@/models/User';               // your mongoose User model

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

        const user = await User.findOne({ email });

        if (!user) {
          console.log('❌ No user found for email:', email);
          throw new Error('Invalid email or password');
        }

        if (!user.password) {
          console.log('❌ User exists but has no password (maybe social login)');
          throw new Error('Please log in with your social account');
        }

        const isValid = await user.comparePassword(password);
        console.log('🔐 Password match:', isValid);

        if (!isValid) {
          throw new Error('Invalid email or password');
        }

        console.log('✅ Auth success for:', user.email);

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
    signIn: '/auth', // your custom login/register component page
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
