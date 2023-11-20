/**
 * @jest-environment node
 */

/* eslint-disable import/no-extraneous-dependencies */


import '@testing-library/jest-dom';
import { createMocks, RequestMethod } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';
import layout from 'pages/api/layout.ts';
import { mockDeep } from 'jest-mock-extended';

jest.mock('next-auth/next');
jest.mock('@prisma/client');

describe('/api/layout API Endpoint', () => {
  jest.mock(`${process.cwd()}/lib/db`, () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>(),
  }));

  function mockRequestResponse(method: RequestMethod = 'GET') {
    const { req, res }: { req: NextApiRequest; res: NextApiResponse } = createMocks({ method });

    req.headers = { 'Content-Type': 'application/json' };
    req.body = { method: 'list' };
    return { req, res };
  }

  getServerSession.mockResolvedValue({ user: { id: 1 } });
  PrismaClient.mockResolvedValue({ layout: { findMany: jest.fn() } });

  it('returns a layout', async () => {
    const { req, res } = mockRequestResponse();

    await layout(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.getHeaders()).toEqual({ 'content-type': 'application/json' });
    expect(res.statusMessage).toEqual('OK');
    expect(res._getJSONData().length).toEqual(1);
  });
});
