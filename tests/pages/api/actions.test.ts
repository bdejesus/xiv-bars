/**
 * @jest-environment node
 */

import { createMocks, RequestMethod } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import actionsHandler from 'pages/api/actions.ts';

// BRD is a valid job abbreviation present in Jobs.json
const VALID_JOB = 'BRD';

describe('/api/actions API Endpoint', () => {
  function mockRequestResponse(method: RequestMethod = 'GET') {
    const { req, res }: { req: NextApiRequest; res: NextApiResponse } = createMocks({ method });
    req.headers = { 'Content-Type': 'application/json' };
    return { req, res };
  }

  it('returns PvE actions for a valid job', async () => {
    const { req, res } = mockRequestResponse();
    req.query = { job: VALID_JOB };
    await actionsHandler(req, res);

    expect(res.statusCode).toBe(200);
    const data = res._getJSONData();
    expect(data).toHaveProperty('actions');
  });

  it('returns PvP actions when isPvp is true', async () => {
    const { req, res } = mockRequestResponse();
    req.query = { job: VALID_JOB, isPvp: 'true' };
    await actionsHandler(req, res);

    expect(res.statusCode).toBe(200);
    const data = res._getJSONData();
    expect(data).toHaveProperty('actions');
  });

  it('returns 404 for an invalid job', async () => {
    const { req, res } = mockRequestResponse();
    req.query = { job: 'INVALID_JOB' };
    await actionsHandler(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ message: 'Job not found' });
  });
});
