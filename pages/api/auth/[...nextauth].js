import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import db from 'lib/db';

async function signinUser(session) {
  let user = await db.user.findUnique({
    where: { email: session.user.email }
  });

  if (session.user.email && !user) {
    user = await db.user.create({
      data: {
        name: session.user.name,
        email: session.user.email
      }
    });
  }

  return user;
}

export const authOptions = {
  providers: [
    // OAuth authentication providers...
    GoogleProvider({
      id: 'google',
      name: 'Google',
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    })
  ],

  callbacks: {
    async session({ session }) {
      const user = await signinUser(session);
      // eslint-disable-next-line no-param-reassign
      session.user = { ...session.user, ...user };
      return session;
    }
  },

  secret: process.env.JWT_SECRET
};

export default NextAuth(authOptions);
