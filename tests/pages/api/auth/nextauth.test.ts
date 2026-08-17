/* @jest-environment node */

import prismaMock from 'tests/__mocks__/dbMock';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import type { Session } from 'next-auth';

jest.mock('next-auth', () => ({ __esModule: true, default: jest.fn() }));

const OLD_URL = 'https://cdn.discordapp.com/avatars/1/oldhash.png';
const NEW_URL = 'https://cdn.discordapp.com/avatars/1/newhash.png';

const storedUser = {
  id: 1,
  name: 'Joe',
  email: 'joe@example.com',
  image: OLD_URL,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  _count: { layouts: 2, hearts: 3 }
};

function sessionWith(image?: string) {
  return {
    user: { name: 'Joe', email: 'joe@example.com', image }
  } as unknown as Session;
}

const { session: sessionCallback } = authOptions.callbacks;

type WriteArgs = { data: object };

// Echoes back the merged row, the way a real create/update does.
const echoWrite = ((args: WriteArgs) => (
  Promise.resolve({ ...storedUser, ...args.data })
)) as never;

beforeEach(() => {
  prismaMock.user.findUnique.mockResolvedValue(storedUser as never);
  prismaMock.user.update.mockImplementation(echoWrite);
  prismaMock.user.create.mockImplementation(echoWrite);
});

describe('session callback', () => {
  // Discord retires the old avatar path when a user changes their avatar. The
  // previous implementation only wrote `image` when it was missing, which froze
  // the first url ever seen and left every later avatar change broken.
  it('takes the new avatar url when Discord hands over a different one', async () => {
    await sessionCallback({ session: sessionWith(NEW_URL) });

    expect(prismaMock.user.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 1 },
      data: { image: NEW_URL }
    }));
  });

  it('does not write when the avatar url is unchanged', async () => {
    await sessionCallback({ session: sessionWith(OLD_URL) });

    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it('does not clear a stored avatar when the session has none', async () => {
    await sessionCallback({ session: sessionWith(undefined) });

    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it('hands the client our own avatar path, never the Discord url', async () => {
    const result = await sessionCallback({ session: sessionWith(NEW_URL) });

    expect(result.user.image).toBe('/api/avatar/1');
  });

  it('records the avatar url as the source for a brand new user', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null as never);

    await sessionCallback({ session: sessionWith(NEW_URL) });

    expect(prismaMock.user.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ image: NEW_URL })
    }));
  });

  it('passes the rest of the user through', async () => {
    const result = await sessionCallback({ session: sessionWith(OLD_URL) });

    expect(result.user).toEqual(expect.objectContaining({
      id: 1,
      name: 'Joe',
      email: 'joe@example.com',
      createdAt: '2026-01-01T00:00:00.000Z',
      _count: { layouts: 2, hearts: 3 }
    }));
  });
});
