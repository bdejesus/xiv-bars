import NextAuth, { Session } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { avatarUrl } from 'lib/avatar';
import db from 'lib/db';

const userInclude = {
  _count: {
    select: { layouts: true, hearts: true }
  }
};

async function signinUser(session: Session) {
  let user = await db.user.findUnique({
    where: { email: session.user.email },
    include: userInclude
  });

  if (session.user.email && !user) {
    user = await db.user.create({
      data: {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image
      },
      include: userInclude
    });
  } else if (user && session.user.image && session.user.image !== user.image) {
    // Discord avatar URLs are content-addressed, so the URL changes every time
    // the user changes their avatar and the previous one stops resolving. Sign-in
    // is the only moment we learn the new one, so always take it -- this used to
    // only fill in a missing image, which left the first URL we ever saw stored
    // forever and every later avatar change rendering as a broken image.
    //
    // Downloading the bytes is left to /api/avatar/[userId], which notices the
    // source moved. Keeping the fetch out of here matters because this callback
    // runs on every session read, not just at sign-in.
    user = await db.user.update({
      where: { id: user.id },
      data: { image: session.user.image },
      include: userInclude
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
          // Hand the client our own stable avatar path, never the Discord URL --
          // the raw URL expires, and this keeps it from leaking into the UI.
          image: avatarUrl(user.id),
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
