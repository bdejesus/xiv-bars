import fs from 'node:fs/promises';
import path from 'node:path';
import { readAvatar } from 'lib/api/avatar';
import { DEFAULT_AVATAR_SRC } from 'lib/avatar';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { StoredAvatar } from 'lib/api/avatar';

// The stable endpoint every profile image on the site points at. The URL never
// changes for the life of the account, so it is safe in prerendered HTML, OG
// tags, and CDN caches -- unlike the Discord CDN URL it stands in front of.

// Long-lived at the edge because the bytes only change when the user changes
// their Discord avatar, which we pick up on their next sign-in.
const CACHE_CONTROL = 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800';

// Short-lived, so a user whose avatar has not been cached yet stops getting the
// placeholder soon after it lands.
const FALLBACK_CACHE_CONTROL = 'public, max-age=300, s-maxage=300';

const DEFAULT_AVATAR_FILE = path.join(process.cwd(), 'public', DEFAULT_AVATAR_SRC);

let defaultAvatar: Buffer | null = null;

// Served inline rather than redirected to /icons/... so the response is always a
// real image with a 200 -- next/image's optimizer treats anything else as a
// failed fetch and renders a broken image.
async function serveDefault(res: NextApiResponse) {
  try {
    if (!defaultAvatar) defaultAvatar = await fs.readFile(DEFAULT_AVATAR_FILE);
  } catch (error) {
    console.error('ERROR: Could not read default avatar', error);
    res.status(404).end();
    return;
  }

  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', FALLBACK_CACHE_CONTROL);
  res.status(200).send(defaultAvatar);
}

function serveAvatar(req: NextApiRequest, res: NextApiResponse, avatar: StoredAvatar) {
  const etag = `W/"avatar-${avatar.updatedAt.getTime()}"`;

  res.setHeader('Cache-Control', CACHE_CONTROL);
  res.setHeader('ETag', etag);

  if (req.headers['if-none-match'] === etag) {
    res.status(304).end();
    return;
  }

  res.setHeader('Content-Type', avatar.contentType ?? 'image/png');
  res.status(200).send(Buffer.from(avatar.data as Uint8Array));
}

export default async function avatarHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    res.status(405).end();
    return;
  }

  const userId = Number(req.query.userId);

  if (!Number.isInteger(userId) || userId < 1) {
    await serveDefault(res);
    return;
  }

  const avatar = await readAvatar(userId).catch((error: Error) => {
    console.error('ERROR: Could not read avatar', error);
    return null;
  });

  if (avatar?.data) {
    serveAvatar(req, res, avatar);
  } else {
    await serveDefault(res);
  }
}
