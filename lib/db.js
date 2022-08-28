import * as Sentry from '@sentry/nextjs';
import { PrismaClient } from '@prisma/client';

function initDb() {
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
    Sentry.captureException(error);
    console.error(error);
  }

  return database;
}

const db = initDb();

export default db;
