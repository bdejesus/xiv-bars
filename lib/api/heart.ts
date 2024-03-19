import db from 'lib/db';

export async function count(layoutId:number) {
  const layoutHearts = await db.heart.findMany({
    where: { layoutId }
  });
  return layoutHearts;
}

export async function list(layoutId:number) {
  const layoutHearts = await db.heart.findMany({
    where: { layoutId }
  });

  return layoutHearts;
}

// export async function listByUser(userId) {
// }

// export async function create(layoutId:number, userId:number) {
// }

const heartMethods = { list };

export default heartMethods;
