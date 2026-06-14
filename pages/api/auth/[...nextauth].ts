import NextAuth, { Session } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import db from 'lib/db';

async function signinUser(session: Session) {
  let user = await db.user.findUnique({
    where: { email: session.user.email },
    include: {
      _count: {
        select: { layouts: true, hearts: true }
      }
    }
  });

  if (session.user.email && !user) {
    user = await db.user.create({
      data: {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image
      },
      include: { _count: { select: { layouts: true, hearts: true } } }
    });
  } else if (user && session.user.image && !user.image) {
    user = await db.user.update({
      where: { id: user.id },
      data: { image: session.user.image },
      include: { _count: { select: { layouts: true, hearts: true } } }
    });
  }

  return user;
}

export const authOptions = {
  providers: [
    DiscordProvider({
      id: 'discord',
      name: 'Discord',
      clientId: process.env.DISCORD_ID || '',
      clientSecret: process.env.DISCORD_SECRET || ''
    })
  ],

  callbacks: {
    async session({ session }: { session: Session }) {
      const user = await signinUser(session);

      if (user) {
        session.user = {
          ...session.user,
          id: user.id,
          name: user.name ?? session.user.name,
          email: user.email,
          image: user.image ?? session.user.image,
          createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt ?? undefined,
          _count: user._count
        };
      }

      return session;
    }
  },

  pages: {
    signIn: '/'
  },

  secret: process.env.JWT_SECRET
};

export default NextAuth(authOptions);
