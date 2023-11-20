/* eslint-disable import/no-extraneous-dependencies */

import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import db from 'lib/db';

jest.mock('../../lib/db', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  // eslint-disable-next-line no-use-before-define
  mockReset(prismaMock);
});

export const prismaMock = db as unknown as DeepMockProxy<PrismaClient>;

export default prismaMock;
