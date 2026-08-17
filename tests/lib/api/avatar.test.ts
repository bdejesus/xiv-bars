import prismaMock from 'tests/__mocks__/dbMock';
import { cacheAvatar, readAvatar } from 'lib/api/avatar';
import { AVATAR_SIZE } from 'lib/avatar';

const SOURCE = 'https://cdn.discordapp.com/avatars/1/oldhash.png';
const NEW_SOURCE = 'https://cdn.discordapp.com/avatars/1/newhash.png';
const PNG = new Uint8Array([137, 80, 78, 71]);

function imageResponse(bytes: Uint8Array = PNG, contentType = 'image/png') {
  return {
    ok: true,
    headers: { get: () => contentType },
    arrayBuffer: () => Promise.resolve(bytes.buffer)
  };
}

function notFoundResponse() {
  return { ok: false, headers: { get: () => null }, arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)) };
}

/** A cached row as it comes back from the database. */
function cachedRow(overrides = {}) {
  return {
    data: PNG,
    contentType: 'image/png',
    source: SOURCE,
    fetchedAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
}

type UpsertArgs = { create?: object, update?: object };

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue(imageResponse());
  // Echoes back whatever was written, the way the real upsert does.
  prismaMock.avatar.upsert.mockImplementation(((args: UpsertArgs) => (
    Promise.resolve({ ...(args.create ?? args.update) })
  )) as never);
});

describe('cacheAvatar', () => {
  it('requests the source at our stored size', async () => {
    await cacheAvatar(1, SOURCE);

    expect(fetch).toHaveBeenCalledWith(
      `${SOURCE}?size=${AVATAR_SIZE}`,
      expect.objectContaining({ redirect: 'error' })
    );
  });

  it('stores the downloaded bytes alongside the source they came from', async () => {
    await cacheAvatar(1, SOURCE);

    expect(prismaMock.avatar.upsert).toHaveBeenCalledWith(expect.objectContaining({
      where: { userId: 1 },
      update: expect.objectContaining({
        source: SOURCE,
        contentType: 'image/png',
        data: expect.any(Uint8Array)
      })
    }));
  });

  it('never fetches a source outside the Discord CDN', async () => {
    const result = await cacheAvatar(1, 'https://evil.example.com/avatars/1/abc.png');

    expect(fetch).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('records the failed attempt with no data so the url is not refetched every request', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(notFoundResponse());

    const result = await cacheAvatar(1, SOURCE);

    expect(result).toBeNull();
    expect(prismaMock.avatar.upsert).toHaveBeenCalledWith(expect.objectContaining({
      update: expect.objectContaining({ source: SOURCE, data: null, contentType: null })
    }));
  });

  it('rejects a response that is not an image', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(imageResponse(PNG, 'text/html'));
    expect(await cacheAvatar(1, SOURCE)).toBeNull();
  });

  it('rejects an empty response body', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(imageResponse(new Uint8Array()));
    expect(await cacheAvatar(1, SOURCE)).toBeNull();
  });

  it('rejects a body over the size cap', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(imageResponse(new Uint8Array(3 * 1024 * 1024)));
    expect(await cacheAvatar(1, SOURCE)).toBeNull();
  });

  it('survives a network error', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('ECONNRESET'));
    expect(await cacheAvatar(1, SOURCE)).toBeNull();
  });
});

describe('readAvatar', () => {
  it('returns the cached bytes without touching Discord when the source is unchanged', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ image: SOURCE, avatar: cachedRow() } as never);

    const avatar = await readAvatar(1);

    expect(avatar?.data).toEqual(PNG);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('caches on first request when nothing is stored yet', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ image: SOURCE, avatar: null } as never);

    const avatar = await readAvatar(1);

    expect(fetch).toHaveBeenCalled();
    expect(avatar?.source).toBe(SOURCE);
  });

  it('re-downloads when the user changed their avatar and the source moved', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ image: NEW_SOURCE, avatar: cachedRow() } as never);

    const avatar = await readAvatar(1);

    expect(fetch).toHaveBeenCalledWith(`${NEW_SOURCE}?size=${AVATAR_SIZE}`, expect.anything());
    expect(avatar?.source).toBe(NEW_SOURCE);
  });

  // The whole point of storing the bytes: a Discord url that has expired must
  // not take the profile image down with it.
  it('keeps serving the stored bytes when the new source fails to download', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ image: NEW_SOURCE, avatar: cachedRow() } as never);
    (global.fetch as jest.Mock).mockResolvedValue(notFoundResponse());

    const avatar = await readAvatar(1);

    expect(avatar?.data).toEqual(PNG);
  });

  it('does not retry a download that failed recently', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      image: SOURCE,
      avatar: cachedRow({ data: null, contentType: null, fetchedAt: new Date() })
    } as never);

    expect(await readAvatar(1)).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('retries a download that failed long enough ago', async () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    prismaMock.user.findUnique.mockResolvedValue({
      image: SOURCE,
      avatar: cachedRow({ data: null, contentType: null, fetchedAt: twoHoursAgo })
    } as never);

    const avatar = await readAvatar(1);

    expect(fetch).toHaveBeenCalled();
    expect(avatar?.data).toEqual(expect.any(Uint8Array));
  });

  it('returns null for an unknown user', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null as never);
    expect(await readAvatar(999)).toBeNull();
  });

  it('returns null when the user has no image and nothing cached', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ image: null, avatar: null } as never);

    expect(await readAvatar(1)).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });
});
