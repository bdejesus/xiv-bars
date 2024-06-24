/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      createdAt: string | undefined;
      id: number,
      name: string,
      email: string,
      image: string,
      _count: {
        layouts?: number,
        hearts?: number
      }
    }
  }
}
