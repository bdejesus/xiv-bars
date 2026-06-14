import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = global as unknown as { db: PrismaClient };

function initDb(): PrismaClient {
  const adapter = new PrismaPg({
    connectionString: process.env.HEROKU_POSTGRESQL_BLUE_URL,
  });
  return new PrismaClient({ adapter });
}

const db = globalForPrisma.db || initDb();
if (process.env.NODE_ENV !== 'production') globalForPrisma.db = db;

export function serializeDates<T extends object>(array: T[]): T[] {
  return array.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      ...r,
      createdAt: (r.createdAt as Date)?.toISOString() ?? null,
      updatedAt: (r.updatedAt as Date)?.toISOString() ?? null,
    } as T;
  });
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

export const layoutsQuery = {
  where: { deletedAt: null },
  select: LAYOUT_SELECT,
  orderBy: { updatedAt: 'desc' as const }
};

export default db;
