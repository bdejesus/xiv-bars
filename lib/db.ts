import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = global as unknown as { db: PrismaClient };

const connectionString = process.env.HEROKU_POSTGRESQL_BLUE_URL;

// Heroku Postgres accepts TLS connections only, and presents a self-signed
// certificate. node-postgres does not negotiate TLS on its own and Heroku's
// connection strings carry no `sslmode`, so it connects in plaintext and gets
// turned away by pg_hba.conf as P1010/28000. The Rust query engine this
// adapter replaced in Prisma 7 handled that automatically. Local Postgres
// serves no TLS, so leave it alone there.
function isLocalDb(url?: string): boolean {
  if (!url) return false;
  try {
    const { hostname } = new URL(url);
    return ['localhost', '127.0.0.1', '::1'].includes(hostname);
  } catch {
    return false;
  }
}

function initDb(): PrismaClient {
  const adapter = new PrismaPg({
    connectionString,
    ssl: isLocalDb(connectionString) ? undefined : { rejectUnauthorized: false },
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
  // No `image` -- the Discord URL it holds expires. Views resolve avatars
  // through `avatarUrl(userId)` and /api/avatar/[userId] instead.
  user: {
    select: { name: true, id: true }
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
