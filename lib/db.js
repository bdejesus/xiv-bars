import { PrismaClient } from '@prisma/client';

export function initDb() {
  let database;

  try {
    if (process.env.NODE_ENV === 'production') {
      database = new PrismaClient();
    } else {
      if (!global.db) {
        global.db = new PrismaClient();
      }

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

export default db;
