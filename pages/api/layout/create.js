/* eslint-disable camelcase */
import db from 'lib/db';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';

async function createLayout(req, res) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);
    await db.layout.create({
      data: { ...req.body, userId: session.user.id }
    });

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error(error);
    res.status(404).json({ status: 404, message: 'not found' });
  }
}

export default createLayout;
