/* eslint-disable camelcase */

import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import layoutApiMethods from 'lib/api/layout';

type UserID = number | undefined;

export default async function layoutHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);
    const userId: UserID = session?.user.id;
    const { body } = req;

    switch (body.method) {
      case 'list': {
        const listLayouts = await layoutApiMethods.list(userId);
        res.status(200).json(listLayouts);
        break;
      }
      case 'create': {
        const createLayout = await layoutApiMethods.create(userId, body);
        const layouts = await layoutApiMethods.list(userId);
        res.status(200).json({ layoutView: createLayout, layouts });
        break;
      }

      case 'read': {
        const readLayout = await layoutApiMethods.read(body.id);
        res.status(200).json(readLayout);
        break;
      }

      case 'update': {
        const updateLayout = await layoutApiMethods.update(userId, body);
        const layouts = await layoutApiMethods.list(userId);
        res.status(200).json({ layoutView: updateLayout, layouts });
        break;
      }

      case 'destroy': {
        const newList = await layoutApiMethods.destroy(userId, body);
        res.status(200).json(newList);
        break;
      }

      default: {
        if (!body.id) {
          const message = 'Not Found';
          const error = new Error(message);
          res.statusMessage = message;
          res.status(404).json(error);
        } else {
          const readLayout = await layoutApiMethods.read(body.id);
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
