import db from 'lib/db';
import { maxLayouts } from 'lib/user';
import type { LayoutProps } from 'types/App';

type LayoutID = string;
type UserID = number | undefined;

function formatData(userId: UserID, data: LayoutProps) {
  const {
    layout, xhb, wxhb, exhb
  } = data;

  return {
    ...data,
    hb: JSON.stringify(data.hb),
    layout: layout ? parseInt(layout.toString(), 10) : 0,
    xhb: xhb ? parseInt(xhb.toString(), 10) : 1,
    wxhb: wxhb ? parseInt(wxhb.toString(), 10) : 0,
    exhb: exhb ? parseInt(exhb.toString(), 10) : 0,
    userId
  };
}

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

export async function create(userId: UserID, data: LayoutProps) {
  const userLayouts = await db.layout.findMany({ where: { userId } });
  if (userLayouts.length > maxLayouts) {
    throw new Error('Max number of layouts reached.');
  } else {
    const layoutData = formatData(userId, data);

    const createLayout = await db.layout.create({
      data: layoutData,
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

export async function update(
  userId:UserID,
  { layoutId, data }:{ layoutId: LayoutID, data: LayoutProps }
) {
  const layoutToUpdate = await db.layout.findFirst({ where: { id: layoutId, userId } });
  if (!layoutToUpdate) throw new Error('Layout not found');

  const today = new Date().toISOString();
  const layoutData = formatData(userId, { ...data, updatedAt: today });

  const updatedLayout = await db.layout.update({
    where: { id: layoutId }, data: layoutData
  });

  return updatedLayout;
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
