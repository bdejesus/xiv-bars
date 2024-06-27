import { PrismaClient } from '@prisma/client';

export function initDb() {
  let database;

  try {
    if (process.env.NODE_ENV === 'production') {
      database = new PrismaClient();
    } else {
      if (!global.db) global.db = new PrismaClient();
      database = global.db;
    }
  } catch (error) {
    console.error(error);
  }

  return database;
}

const db = initDb();

export function serializeDates(array) {
  return array.map((row) => ({
    ...row,
    createdAt: row.createdAt?.toISOString(),
    updatedAt: row.updatedAt?.toISOString()
  }));
}

const selectLayoutColumns = {
  id: true,
  title: true,
  description: true,
  jobId: true,
  isPvp: true,
  layout: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: false,
  userId: true,
  published: true,
  user: {
    select: { name: true, id: true }
  },
  _count: {
    select: { hearts: true }
  }
};

export const layoutsQuery = {
  where: { deletedAt: null },
  select: selectLayoutColumns,
  orderBy: { updatedAt: 'desc' }
};

export default db;
