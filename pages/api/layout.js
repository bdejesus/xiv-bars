/* eslint-disable camelcase */
import db from 'lib/db';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { maxLayouts } from 'lib/user';

async function create(userId, { data }) {
  const userLayouts = await db.layout.findMany({ where: { userId } });
  if (userLayouts.length < maxLayouts) throw new Error('Too many layouts');
  const createLayout = await db.layout.create({ data: { ...data, userId } });
  return createLayout;
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
  return { status: 'ok' };
}

export default async function layout(req, res) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);
    const userId = session?.user.id;
    const { body } = req;

    switch (body.method) {
      case 'create': {
        const createLayout = await create(userId, body);
        res.status(200).json(createLayout);
        break;
      }

      case 'read': {
        const readLayout = await read(body);
        res.status(200).json(readLayout);
        break;
      }

      case 'update': {
        const updateLayout = await update(userId, body);
        res.status(200).json(updateLayout);
        break;
      }

      case 'destroy': {
        await destroy(userId, body);
        res.status(200).json({ message: 'ok' });
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
  }
}
