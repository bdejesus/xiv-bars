import db from 'lib/db';
import { maxLayouts } from 'lib/user';
import type { LayoutDataProps } from 'types/View';

type LayoutID = string;
type UserID = number | undefined;

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

export async function create(userId:UserID, data:LayoutDataProps) {
  const userLayouts = await db.layout
    .findMany({ where: { userId } })
    .catch((error:Error) => console.error(error));

  if (userLayouts.length > maxLayouts) {
    throw new Error('Max number of layouts reached.');
  } else {
    const createLayout = await db.layout
      .create({
        data: { ...data, userId },
        include: { user: { select: { name: true } } }
      })
      .catch((error:Error) => console.error(error));
    return createLayout;
  }
}

export async function read(id: LayoutID) {
  if (!id) throw new Error('Layout not found');

  const viewData = await db.layout
    .findUnique({
      where: { id: parseInt(id, 10) },
      include: { user: { select: { name: true, id: true } } }
    })
    .catch((error:Error) => console.error(error));

  return viewData;
}

export async function update(userId:UserID, data:LayoutDataProps) {
  const { id } = data;
  const layoutToUpdate = await db.layout
    .findFirst({ where: { id, userId } })
    .catch((error:Error) => console.error(error));

  if (!layoutToUpdate) throw new Error('Layout not found');

  const today = new Date().toISOString();
  const viewData = { ...data, updatedAt: today };

  const updatedLayout = await db.layout
    .update({
      where: { id },
      data: viewData,
      include: { user: { select: { name: true, id: true } } }
    })
    .catch((error:Error) => console.error(error));

  return updatedLayout;
}

export async function destroy(userId: UserID, { id }: { id:LayoutID }) {
  if (!userId || !id) throw new Error('Layout not found');
  await db.layout
    .deleteMany({ where: { id, userId } })
    .catch((error:Error) => console.error(error));

  const newList = await list(userId);
  return newList;
}

const layoutsApi = {
  list, create, read, update, destroy
};

export default layoutsApi;
