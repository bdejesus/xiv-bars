/**
 * @jest-environment node
 */

/* eslint-disable import/no-extraneous-dependencies */

import '@testing-library/jest-dom';
import { createMocks, RequestMethod } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import layoutHandler from 'pages/api/layout.ts';
import { mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

jest.mock('next-auth/next');
jest.mock('@prisma/client');
jest.mock('lib/api/layout', () => ({
  list: jest.fn(() => Promise.resolve('Mocked Data')),
  create: jest.fn(() => Promise.resolve('Mocked Data')),
  read: jest.fn(() => Promise.resolve('Mocked Data')),
  update: jest.fn(() => Promise.resolve('Mocked Data')),
  destroy: jest.fn(() => Promise.resolve('Mocked Data'))
}));

describe('/api/layout API Endpoint', () => {
  jest.mock(`${process.cwd()}/lib/db`, () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>(),
  }));

  function mockRequestResponse(method: RequestMethod = 'GET') {
    const { req, res }: { req: NextApiRequest; res: NextApiResponse } = createMocks({ method });
    req.headers = { 'Content-Type': 'application/json' };
    return { req, res };
  }

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns a layouts list', async () => {
    const { req, res } = mockRequestResponse();
    req.body = { method: 'list' };
    await layoutHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.getHeaders()).toEqual({ 'content-type': 'application/json' });
    expect(res.statusMessage).toEqual('OK');
  });

  it('returns a layout', async () => {
    const { req, res } = mockRequestResponse();
    req.body = { method: 'read', layoutId: 1 };
    await layoutHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.getHeaders()).toEqual({ 'content-type': 'application/json' });
    expect(res.statusMessage).toEqual('OK');
  });

  it('does not return invalid methods', async () => {
    const { req, res } = mockRequestResponse();
    req.body = { method: 'not_a_method', id: null };
    await layoutHandler(req, res);

    expect(res.statusCode).toBe(404);
    expect(res.getHeaders()).toEqual({ 'content-type': 'application/json' });
    expect(res.statusMessage).toEqual('Not Found');
  });
});
