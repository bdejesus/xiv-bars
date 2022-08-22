import { PrismaClient } from '@prisma/client';

function initDb() {
  let database;

  if (process.env.NODE_ENV === 'production') {
    database = new PrismaClient();
  } else {
    if (!global.db) {
      global.db = new PrismaClient();
    }

    database = global.db;
  }

  return database;
}

const db = initDb();

export default db;
