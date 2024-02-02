import db from 'lib/db';
import { maxLayouts } from 'lib/user';
import type { ViewDataProps } from 'types/View';

type LayoutID = string;
type UserID = number | undefined;

function formatData(data:ViewDataProps) {
  const viewData = Object.entries(data).reduce((collection, [key, value]) => {
    if (key === 'hb') return { ...collection, hb: JSON.stringify(data.hb) };
    if (value !== undefined && value !== null) return { ...collection, [key]: value };
    return collection;
  }, {});

  return viewData;
}

export async function list(userId:UserID) {
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

export async function create(data:ViewDataProps) {
  const userLayouts = await db.layout.findMany({ where: { userId: data.userId } });
  if (userLayouts.length > maxLayouts) {
    throw new Error('Max number of layouts reached.');
  } else {
    const createLayout = await db.layout.create({
      data: formatData(data),
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

  const viewData = await db.layout.findUnique({
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

  return viewData;
}

export async function update(
  userId:UserID,
  { layoutId, data }:{ layoutId:LayoutID, data:ViewDataProps }
) {
  const layoutToUpdate = await db.layout.findFirst({ where: { id: layoutId, userId } });
  if (!layoutToUpdate) throw new Error('Layout not found');

  const today = new Date().toISOString();
  const viewData = formatData({ ...data, updatedAt: today, userId });

  const updatedLayout = await db.layout.update({
    where: { id: layoutId }, data: viewData
  });

  return updatedLayout;
}

export async function destroy(userId: UserID, { id }: { id:LayoutID }) {
  if (!userId || !id) throw new Error('Layout not found');
  await db.layout.deleteMany({ where: { id, userId } });
  const newList = await list(userId);
  return newList;
}

const layoutsApi = {
  list, create, read, update, destroy
};

export default layoutsApi;
