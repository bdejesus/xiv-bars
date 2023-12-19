import db from 'lib/db';
import { maxLayouts } from 'lib/user';

type LayoutID = string;
type UserID = number | undefined;

export async function list(userId: UserID) {
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

export async function create(userId: UserID, { data }: { data: object }) {
  const userLayouts = await db.layout.findMany({ where: { userId } });
  if (userLayouts.length > maxLayouts) {
    throw new Error('Max number of layouts reached.');
  } else {
    const createLayout = await db.layout.create({
      data: { ...data, userId },
      include: {
        user: {
          select: { name: true }
        }
      }
    });
    return createLayout;
  }
}

export async function read(id: LayoutID) {
  if (!id) throw new Error('Layout not found');

  const readLayout = await db.layout.findUnique({
    where: {
      id: parseInt(id, 10)
    },
    include: {
      user: {
        select: {
          name: true,
          id: true
        }
      }
    }
  });
  return readLayout;
}

export async function update(userId: UserID, { id, data }: { id: LayoutID, data: object }) {
  const layoutToUpdate = await db.layout.findFirst({ where: { id, userId } });
  if (!layoutToUpdate) throw new Error('Layout not found');

  const today = new Date().toISOString();
  const updateLayout = await db.layout.update({
    where: { id }, data: { ...data, updatedAt: today }
  });

  return updateLayout;
}

export async function destroy(userId: UserID, { id }: { id: LayoutID}) {
  if (!userId || !id) throw new Error('Layout not found');
  await db.layout.deleteMany({ where: { id, userId } });
  const newList = await list(userId);
  return newList;
}

const layoutApiMethods = {
  list, create, read, update, destroy
};

export default layoutApiMethods;
