/* eslint-disable camelcase */
import db from 'lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { maxLayouts } from 'lib/user';

type UserID = number | undefined;
type LayoutID = string;

async function list(userId: UserID) {
  const layouts = await db.layout.findMany({
    where: { userId },
    include: {
      user: {
        select: { name: true }
      }
    },
    orderBy: {
      updatedAt: 'desc'
    },
    take: maxLayouts
  });
  return layouts;
}

async function create(userId: UserID, { data }: { data: object }) {
  const userLayouts = await db.layout.findMany({ where: { userId } });
  if (userLayouts.length > maxLayouts) {
    throw new Error('Max number of layouts reached.');
  } else {
    const createLayout = await db.layout.create({ data: { ...data, userId } });
    return createLayout;
  }
}

async function read(id: LayoutID) {
  const readLayout = await db.layout.findUnique({
    where: { id: parseInt(id, 10) }
  });
  return readLayout;
}

async function update(userId: UserID, { id, data }: { id: LayoutID, data: object }) {
  const layoutToUpdate = await db.layout.findFirst({ where: { id, userId } });
  if (!layoutToUpdate) throw new Error('Layout not found');
  const today = new Date().toISOString();
  const updateLayout = await db.layout.update({
    where: { id }, data: { ...data, updatedAt: today }
  });

  return updateLayout;
}

async function destroy(userId: UserID, { id }: { id: LayoutID}) {
  await db.layout.deleteMany({ where: { id, userId } });
  const newList = await list(userId);
  return newList;
}

async function layout(req: NextApiRequest, res: NextApiResponse) {
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
        res.status(200).json(readLayout);
        break;
      }
    }
  } catch (error) {
    console.error(error);
    res.status(200).json(error);
  }
}

export default layout;
