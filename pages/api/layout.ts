/* eslint-disable camelcase */

import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import {
  list, create, read, update, destroy
} from 'lib/api/layout';

type UserID = number | undefined;

export default async function layoutHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);
    const userId: UserID = session?.user.id;
    const { body } = req;

    switch (body.method) {
      case 'list': {
        const listLayouts = await list(userId);
        res.status(200).json(listLayouts);
        break;
      }
      case 'create': {
        const createLayout = await create(userId, body);
        const layouts = await list(userId);
        res.status(200).json([createLayout, layouts]);
        break;
      }

      case 'read': {
        const readLayout = await read(body);
        res.status(200).json(readLayout);
        break;
      }

      case 'update': {
        const updateLayout = await update(userId, body);
        const layouts = await list(userId);
        res.status(200).json([updateLayout, layouts]);
        break;
      }

      case 'destroy': {
        const newList = await destroy(userId, body);
        res.status(200).json(newList);
        break;
      }

      default: {
        const readLayout = await read(body.id);
        res.statusMessage = 'Not Found';
        res.status(404).json(readLayout);
        break;
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
}

export const layoutMethods = { list };
