/* eslint-disable camelcase */
import db from 'lib/db';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { maxLayouts } from 'lib/user';
import { byKey } from 'lib/utils/array';

async function list(userId) {
  const listLayouts = await db.layout.findMany({ where: { userId } });
  return listLayouts.sort(byKey('updatedAt', 'desc'));
}

async function create(userId, { data }) {
  const userLayouts = await db.layout.findMany({ where: { userId } });
  if (userLayouts.length > maxLayouts) {
    throw new Error('Max number of layouts reached.');
  } else {
    const createLayout = await db.layout.create({ data: { ...data, userId } });
    return createLayout;
  }
}

async function read(id) {
  const readLayout = await db.layout.findUnique({
    where: { id: parseInt(id, 10) }
  });
  return readLayout;
}

async function update(userId, { id, data }) {
  const layoutToUpdate = await db.layout.findFirst({ where: { id, userId } });
  if (!layoutToUpdate) throw new Error('Layout not found');
  const today = new Date().toISOString();
  const updateLayout = await db.layout.update({
    where: { id }, data: { ...data, updatedAt: today }
  });

  return updateLayout;
}

async function destroy(userId, { id }) {
  await db.layout.deleteMany({ where: { id, userId } });
  const newList = await list(userId);
  return newList;
}

async function layout(req, res) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);
    const userId = session?.user.id;
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

  req.end();
}

export default layout;
