/**
 * @jest-environment node
 */

import '@testing-library/jest-dom';
import { createMocks, RequestMethod } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import layoutHandler from 'pages/api/layout.ts';

jest.mock('next-auth/next', () => ({ getServerSession: jest.fn() }));
const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;

jest.mock(`${process.cwd()}/pages/api/auth/[...nextauth]`, () => ({ authOptions: {} }));

jest.mock('lib/api/layout', () => ({
  list: jest.fn(() => Promise.resolve('Mocked Data')),
  create: jest.fn(() => Promise.resolve('Mocked Data')),
  read: jest.fn(() => Promise.resolve('Mocked Data')),
  update: jest.fn(() => Promise.resolve('Mocked Data')),
  destroy: jest.fn(() => Promise.resolve('Mocked Data'))
}));

describe('/api/layout API Endpoint', () => {
  function mockRequestResponse(method: RequestMethod = 'POST') {
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
  });

  it('creates a layout', async () => {
    const { req, res } = mockRequestResponse();
    req.body = { method: 'create', data: { title: 'New Layout' } };
    await layoutHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ layoutView: 'Mocked Data', layouts: 'Mocked Data' });
  });

  it('reads a layout', async () => {
    const { req, res } = mockRequestResponse();
    req.body = { method: 'read', layoutId: 1 };
    await layoutHandler(req, res);

    expect(res.statusCode).toBe(200);
  });

  it('updates a layout', async () => {
    const { req, res } = mockRequestResponse();
    req.body = { method: 'update', data: { id: 1, title: 'Updated' } };
    await layoutHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ layoutView: 'Mocked Data', layouts: 'Mocked Data' });
  });

  it('destroys a layout', async () => {
    const { req, res } = mockRequestResponse();
    req.body = { method: 'destroy', id: 1 };
    await layoutHandler(req, res);

    expect(res.statusCode).toBe(200);
  });

  it('creates a heart when authorized', async () => {
    mockGetServerSession.mockResolvedValueOnce({ user: { id: 1 } } as never);
    const { req, res } = mockRequestResponse();
    req.body = { method: 'heart', layoutId: 14 };
    await layoutHandler(req, res);

    expect(res.statusCode).toBe(200);
    const data = res._getJSONData();
    expect(data).toHaveProperty('hearted');
    expect(data).toHaveProperty('count');
  });

  it('returns 401 for heart when unauthorized', async () => {
    mockGetServerSession.mockResolvedValueOnce(null);
    const { req, res } = mockRequestResponse();
    req.body = { method: 'heart', layoutId: 14 };
    await layoutHandler(req, res);

    expect(res.statusCode).toBe(401);
  });

  it('removes a heart when heartId is provided', async () => {
    const { req, res } = mockRequestResponse();
    req.body = { method: 'unheart', heartId: 5, layoutId: 14 };
    await layoutHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toHaveProperty('count');
  });

  it('returns 401 for unheart when no heartId', async () => {
    const { req, res } = mockRequestResponse();
    req.body = { method: 'unheart', layoutId: 14 };
    await layoutHandler(req, res);

    expect(res.statusCode).toBe(401);
  });

  it('returns 404 for unknown method with no id', async () => {
    const { req, res } = mockRequestResponse();
    req.body = { method: 'not_a_method', id: null };
    await layoutHandler(req, res);

    expect(res.statusCode).toBe(404);
    expect(res.statusMessage).toEqual('Not Found');
  });

  it('reads a layout for unknown method when id is set', async () => {
    const { req, res } = mockRequestResponse();
    req.body = { method: 'not_a_method', id: 1, layoutId: 14 };
    await layoutHandler(req, res);

    expect(res.statusCode).toBe(200);
  });
});
