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

export const LAYOUT_SELECT = {
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
    select: { name: true, id: true, image: true }
  },
  _count: {
    select: { hearts: true }
  }
};

// Fields that are server-generated or relational and must be stripped before
// sending layout data to the DB (e.g. in SaveForm).
export const LAYOUT_FILTER_KEYS = [
  'user',
  'createdAt',
  'deletedAt',
  'updatedAt',
  'hearted',
  '_count',
  'userId',
  'parentLayout'
];

export const layoutsQuery = {
  where: { deletedAt: null },
  select: LAYOUT_SELECT,
  orderBy: { updatedAt: 'desc' }
};

export default db;
