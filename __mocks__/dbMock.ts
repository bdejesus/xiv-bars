/* eslint-disable import/no-extraneous-dependencies */
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy } from 'jest-mock-extended';
import type { ViewDataProps } from 'types/Layout';
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
  hb: '[1,1,1,1,1,1,1,1,1,1]',
  user: {
    name: 'bejezus',
    id: 1
  }
};

const layouts:ViewDataProps[] = [layout];

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
