/* eslint-disable camelcase */
import { PrismaClient } from '@prisma/client';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';

export default async function layouts(req, res) {
  const prisma = new PrismaClient();

  try {
    const session = await unstable_getServerSession(req, res, authOptions);
    const results = await prisma.layout.findMany({
      where: { userId: session.user.id }
    });
    res.status(200).json(results);
  } catch (error) {
    res.status(404).json({ status: 404, message: 'Not Found' });
  }
}
