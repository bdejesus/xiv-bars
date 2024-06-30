/* eslint-disable camelcase */
import db from 'lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import layoutsApi from 'lib/api/layout';

type UserID = number | undefined;

export default async function layoutHandler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  try {
    const userId: UserID = session?.user.id;
    const { body } = req;

    switch (body.method) {
      case 'list': {
        const listLayouts = await layoutsApi.list(userId);
        res.status(200).json(listLayouts);
        break;
      }

      case 'create': {
        const createLayout = await layoutsApi.create(userId, body.data);
        const layouts = await layoutsApi.list(userId);

        res.status(200).json({ layoutView: createLayout, layouts });
        break;
      }

      case 'read': {
        const readLayout = await layoutsApi
          .read(body.layoutId, body.viewerId)
          .catch((error) => console.error(error));
        res.status(200).json(readLayout);
        break;
      }

      case 'update': {
        const updateLayout = await layoutsApi.update(body.data);
        const layouts = await layoutsApi.list(userId);
        res.status(200).json({ layoutView: updateLayout, layouts });
        break;
      }

      case 'destroy': {
        const newList = await layoutsApi.destroy(userId, body);
        res.status(200).json(newList);
        break;
      }

      case 'heart': {
        if (userId && body.layoutId) {
          const hearted = await db.heart.create({ data: { userId, layoutId: body.layoutId } });
          const count = await db.heart.count({ where: { layoutId: body.layoutId } });
          res.status(200).json({ count, hearted });
        } else {
          res.status(401).json({ error: 'Heart Unauthorized', body });
        }
        break;
      }

      case 'unheart': {
        if (body.heartId) {
          await db.heart
            .delete({ where: { id: body.heartId } })
            .catch((error:object) => console.error(error));

          const count = await db.heart
            .count({ where: { layoutId: body.layoutId } })
            .catch((error:object) => console.error(error));

          res.status(200).json({ count, hearted: undefined });
        } else {
          res.status(401).json({ error: 'Unheart Unauthorized', body });
        }
        break;
      }

      default: {
        if (!body.id) {
          const message = 'Not Found';
          const error = new Error(message);
          res.statusMessage = message;
          res.status(404).json(error);
        } else {
          const readLayout = await layoutsApi
            .read(body.layoutId, body.viewerId);
          res.status(200).json(readLayout);
        }
        break;
      }
    }
  } catch (error) {
    const message = 'Not Found';
    res.statusMessage = message;
    res.status(404).json(error);
  }
}
