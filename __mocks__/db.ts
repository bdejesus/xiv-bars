import { PrismaClient } from '@prisma/client';
import { DeepMockProxy } from 'jest-mock-extended';
import db from 'lib/db';

const today = new Date();
const layouts = [{
  id: 14,
  userId: 1,
  title: 'Just a test',
  description: 'Yeah, just a test',
  jobId: 'BRD',
  isPvp: false,
  layout: 0,
  encodedSlots: '106,101,107',
  createdAt: today,
  updatedAt: today,
  deletedAt: null,
  xhb: 1,
  wxhb: 0,
  exhb: 0,
  hb: '[1,1,1,1,1,1,1,1,1,1]',
  user: { name: 'bejezus' }
}];

jest.mock('../lib/db', () => ({
  __esModule: true,
  default: {
    layout: {
      findMany: jest.fn(() => layouts)
    }
  }
}));

export const prismaMock = db as unknown as DeepMockProxy<PrismaClient>;

export default prismaMock;
