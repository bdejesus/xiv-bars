/* @jest-environment node */

import { createMocks, RequestMethod } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import avatarHandler from 'pages/api/avatar/[userId]';
import { readAvatar } from 'lib/api/avatar';

jest.mock('lib/api/avatar', () => ({ readAvatar: jest.fn() }));

const mockReadAvatar = readAvatar as jest.MockedFunction<typeof readAvatar>;

const PNG = new Uint8Array([137, 80, 78, 71]);
const updatedAt = new Date('2026-01-01T00:00:00.000Z');

interface ApiProps {
  req: NextApiRequest;
  res: NextApiResponse;
}

function mockRequestResponse(query: object, method: RequestMethod = 'GET') {
  const { req, res }: ApiProps = createMocks({ method, query });
  return { req, res };
}

function storedAvatar(overrides = {}) {
  return {
    data: PNG,
    contentType: 'image/png',
    source: 'https://cdn.discordapp.com/avatars/1/abc.png',
    fetchedAt: updatedAt,
    updatedAt,
    ...overrides
  };
}

describe('/api/avatar/[userId] API Endpoint', () => {
  it('serves the cached bytes with a long cache lifetime', async () => {
    mockReadAvatar.mockResolvedValue(storedAvatar());
    const { req, res } = mockRequestResponse({ userId: '1' });

    await avatarHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.getHeader('Content-Type')).toBe('image/png');
    expect(res.getHeader('Cache-Control')).toContain('s-maxage=86400');
    expect(res.getHeader('ETag')).toBe(`W/"avatar-${updatedAt.getTime()}"`);
  });

  it('answers 304 when the client already has the current bytes', async () => {
    mockReadAvatar.mockResolvedValue(storedAvatar());
    const { req, res } = mockRequestResponse({ userId: '1' });
    req.headers = { 'if-none-match': `W/"avatar-${updatedAt.getTime()}"` };

    await avatarHandler(req, res);

    expect(res.statusCode).toBe(304);
  });

  // next/image treats any non-200 upstream as a failed fetch, so a user with no
  // cached avatar still has to get a real image back.
  it('serves the placeholder inline when there is nothing cached', async () => {
    mockReadAvatar.mockResolvedValue(null);
    const { req, res } = mockRequestResponse({ userId: '1' });

    await avatarHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.getHeader('Content-Type')).toBe('image/png');
    expect(res.getHeader('Cache-Control')).toContain('max-age=300');
  });

  it('serves the placeholder for a malformed user id without hitting the database', async () => {
    const { req, res } = mockRequestResponse({ userId: 'not-a-number' });

    await avatarHandler(req, res);

    expect(mockReadAvatar).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
  });

  it('serves the placeholder when the lookup throws', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockReadAvatar.mockRejectedValue(new Error('db is down'));
    const { req, res } = mockRequestResponse({ userId: '1' });

    await avatarHandler(req, res);

    expect(res.statusCode).toBe(200);
  });

  it('rejects methods other than GET and HEAD', async () => {
    const { req, res } = mockRequestResponse({ userId: '1' }, 'POST');

    await avatarHandler(req, res);

    expect(res.statusCode).toBe(405);
    expect(res.getHeader('Allow')).toBe('GET, HEAD');
  });
});
