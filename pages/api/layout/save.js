/* eslint-disable camelcase */
import db from 'lib/db';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';

async function saveLayout(req, res) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) throw new Error('Not logged in');

    if (req.body.id) {
      // update data
      const layout = db.layout.findFirst({ where: { id: req.body.id, userId: session.user.id } });
      if (!layout) throw new Error('Layout not found');

      const today = new Date().toISOString();
      const viewData = await db.layout.update({
        where: { id: req.body.id },
        data: {
          ...req.body.data,
          updatedAt: today
        }
      });

      res.status(200).json(viewData);
    } else {
      // create data
      const viewData = await db.layout.create({
        data: {
          ...req.body.data,
          userId: session.user.id
        }
      });
      res.status(200).json(viewData);
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ status: 404, message: 'not found' });
  }
}

export default saveLayout;
