/* eslint-disable camelcase */
import db from 'lib/db';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';

export default async function layouts(req, res) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);
    const results = await db.layout.findMany({
      where: { userId: session.user.id }
    });
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(404).json({ status: 404, message: 'Not Found' });
  }
}
