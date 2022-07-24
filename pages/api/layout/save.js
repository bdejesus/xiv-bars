/* eslint-disable camelcase */
import db from 'lib/db';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';

async function saveLayout(req, res) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (req.body.id) {
      await db.layout.update({
        where: { id: req.body.id }, data: req.body.data
      });
    } else {
      await db.layout.create({
        data: { ...req.body.data, userId: session.user.id }
      });
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error(error);
    res.status(404).json({ status: 404, message: 'not found' });
  }
}

export default saveLayout;
