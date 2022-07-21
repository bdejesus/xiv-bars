/* eslint-disable camelcase */
import { PrismaClient } from '@prisma/client';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';

async function createLayout(req, res) {
  const prisma = new PrismaClient();

  try {
    const session = await unstable_getServerSession(req, res, authOptions);
    await prisma.layout.create({
      data: { ...req.body, userId: session.user.id }
    });

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    res.status(404).json({ status: 404, message: 'not found' });
  }
}

export default createLayout;
