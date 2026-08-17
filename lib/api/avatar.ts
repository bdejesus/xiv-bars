import db from 'lib/db';
import { timeElapsed } from 'lib/utils/time';
import { isDiscordAvatarSource, sizedAvatarSource } from 'lib/avatar';

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 5000;

// How long to wait before retrying a source that failed to download. Covers a
// transient CDN blip without hammering Discord for URLs that are gone for good.
const RETRY_AFTER_MINUTES = 60;

export interface StoredAvatar {
  data: Uint8Array | null;
  contentType: string | null;
  source: string;
  fetchedAt: Date;
  updatedAt: Date;
}

const AVATAR_SELECT = {
  data: true,
  contentType: true,
  source: true,
  fetchedAt: true,
  updatedAt: true
};

async function download(source: string) {
  // SSRF guard: only ever fetch from Discord's CDN. `redirect: 'error'` keeps a
  // redirect off the allowlisted host from becoming a way around this check --
  // avatar paths are served directly, so a redirect is not expected.
  if (!isDiscordAvatarSource(source)) return null;

  try {
    const response = await fetch(sizedAvatarSource(source), {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      redirect: 'error'
    });

    if (!response.ok) return null;

    const contentType = response.headers.get('content-type');
    if (!contentType?.startsWith('image/')) return null;

    const data = new Uint8Array(await response.arrayBuffer());
    if (data.byteLength === 0 || data.byteLength > MAX_AVATAR_BYTES) return null;

    return { data, contentType };
  } catch {
    return null;
  }
}

/**
 * Downloads `source` and stores the bytes against the user, replacing whatever
 * was cached before. A failed download is recorded as a row with no data, so
 * the serving route stops retrying a dead URL on every single request.
 *
 * Returns the stored record, or null when the download failed.
 */
export async function cacheAvatar(userId: number, source: string): Promise<StoredAvatar | null> {
  const downloaded = await download(source);
  const record = {
    source,
    data: downloaded?.data ?? null,
    contentType: downloaded?.contentType ?? null,
    fetchedAt: new Date()
  };

  const stored = await db.avatar
    .upsert({
      where: { userId },
      create: { userId, ...record },
      update: record,
      select: AVATAR_SELECT
    })
    .catch((error: Error) => {
      console.error('ERROR: Could not cache avatar', error);
      return null;
    });

  return downloaded ? stored : null;
}

function shouldRefetch(avatar: StoredAvatar, source: string | null): boolean {
  // The source moved -- the user changed their Discord avatar since we last looked.
  if (source && avatar.source !== source) return true;
  // A previous attempt failed; give it another try once the backoff has passed.
  if (!avatar.data) return timeElapsed(avatar.fetchedAt, new Date(), 'minutes') > RETRY_AFTER_MINUTES;
  return false;
}

/**
 * The user's cached avatar bytes, refreshing them from Discord when the source
 * URL has moved on. If that refresh fails we keep serving the bytes we already
 * have -- a stale avatar beats a broken image, and it is the whole point of
 * caching them in the first place.
 *
 * Returns null when there is nothing to serve and the caller should fall back.
 */
export async function readAvatar(userId: number): Promise<StoredAvatar | null> {
  const user = await db.user.findUnique({
    where: { id: userId, deletedAt: null },
    select: { image: true, avatar: { select: AVATAR_SELECT } }
  });

  if (!user) return null;

  const cached = user.avatar as StoredAvatar | null;

  if (!cached) {
    return user.image ? cacheAvatar(userId, user.image) : null;
  }

  if (shouldRefetch(cached, user.image)) {
    const refreshed = user.image ? await cacheAvatar(userId, user.image) : null;
    if (refreshed) return refreshed;
  }

  return cached.data ? cached : null;
}

const avatarApi = { cacheAvatar, readAvatar };

export default avatarApi;
