/* eslint-disable import/no-extraneous-dependencies */
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy } from 'jest-mock-extended';
import type { LayoutViewProps } from 'types/Layout';
import db from 'lib/db';

const today = new Date();
const layout = {
  id: 14,
  userId: 1,
  title: 'Just a test',
  description: 'Yeah, just a test',
  jobId: 'BRD',
  isPvp: false,
  layout: 0,
  encodedSlots: '106,101,107',
  createdAt: today.toString(),
  updatedAt: today.toString(),
  deletedAt: null,
  xhb: 1,
  wxhb: 0,
  exhb: 0,
  hb: new Array(10).fill(1, 0, 10),
  user: {
    name: 'bejezus',
    id: 1
  },
  hearted: undefined,
  _count: {
    hearts: 0
  }
};

const layouts:LayoutViewProps[] = [layout];

jest.mock('../lib/db', () => ({
  __esModule: true,
  default: {
    layout: {
      findMany: jest.fn(() => layouts),
      findUnique: jest.fn(() => layout)
    }
  }
}));

export const prismaMock = db as unknown as DeepMockProxy<PrismaClient>;

export default prismaMock;
