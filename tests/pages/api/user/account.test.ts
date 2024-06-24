/* @jest-environment node */
/* eslint-disable import/no-extraneous-dependencies */

import '@testing-library/jest-dom';
import { createMocks, RequestMethod } from 'node-mocks-http';
import { mockDeep } from 'jest-mock-extended';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import accountHandler from 'pages/api/user/account.ts';
import { PrismaClient } from '@prisma/client';
import db from '@/__mocks__/dbMock';

// Setup mocks for db instance
jest.mock('@prisma/client');
// Setup mocks for user session
const user = { id: 1, name: 'Joe' };
jest.mock('next-auth/next', () => ({ getServerSession: jest.fn() }));
const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
jest.mock(`${process.cwd()}/pages/api/auth/[...nextauth]`, () => ({
  default: jest.fn()
}));

interface ApiProps {
  req: NextApiRequest;
  res: NextApiResponse
}

beforeEach(() => {
  // restore replaced property
  jest.restoreAllMocks();
});

describe('/api/user/account API Endpoint', () => {
  jest.mock(`${process.cwd()}/lib/db`, () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>()
  }));

  function mockRequestResponse(method: RequestMethod = 'GET') {
    const { req, res }:ApiProps = createMocks({ method });
    req.headers = { 'Content-Type': 'application/json' };
    return { req, res };
  }

  it('calls delete action', async () => {
    mockGetServerSession.mockImplementationOnce(async () => ({ user }));
    const { req, res } = mockRequestResponse();
    req.body = { method: 'destroy' };

    await accountHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.statusMessage).toEqual('OK');
    expect(db.user.delete).toHaveBeenCalledTimes(1);
  });

  it('returns bad request', async () => {
    mockGetServerSession.mockImplementationOnce(async () => ({ user }));
    const { req, res } = mockRequestResponse();

    await accountHandler(req, res);
    expect(db.user.delete).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(400);
  });

  it('returns unauthorized', async () => {
    const { req, res } = mockRequestResponse();
    await accountHandler(req, res);
    expect(db.user.delete).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(401);
  });
});
