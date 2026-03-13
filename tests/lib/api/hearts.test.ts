import { createHeart, breakHeart } from 'lib/api/hearts';

const mockResponse = { id: 1, layoutId: 42 };

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockResponse),
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('createHeart', () => {
  it('POSTs to /api/layout with the correct body', async () => {
    await createHeart(42);

    expect(fetch).toHaveBeenCalledWith('/api/layout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method: 'heart', layoutId: 42 }),
    });
  });

  it('returns parsed JSON from the response', async () => {
    const result = await createHeart(42);
    expect(result).toEqual(mockResponse);
  });
});

describe('breakHeart', () => {
  it('POSTs to /api/layout with the correct body', async () => {
    await breakHeart(42, 7);

    expect(fetch).toHaveBeenCalledWith('/api/layout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method: 'unheart', layoutId: 42, heartId: 7 }),
    });
  });

  it('returns parsed JSON from the response', async () => {
    const result = await breakHeart(42, 7);
    expect(result).toEqual(mockResponse);
  });
});
