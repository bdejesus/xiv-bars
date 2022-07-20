/* eslint-disable camelcase */
import { PrismaClient } from '@prisma/client';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';

const prisma = new PrismaClient();

export default async function layouts(req, res) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);
    const results = await prisma.layout.findMany({
      where: { user_id: session.user.id }
    });
    res.status(200).json(results);
  } catch (error) {
    res.status(404).json({ status: 404, message: 'Not Found' });
  }
}
