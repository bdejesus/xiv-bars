// Discord serves profile images from a content-addressed path:
// https://cdn.discordapp.com/avatars/{discordUserId}/{avatarHash}.png
//
// The filename is a hash of the image itself, so changing an avatar mints a new
// hash and retires the old path. Any Discord URL we persist is therefore only
// valid until the user next changes their avatar, after which it 404s forever.
//
// Nothing in the app renders a Discord URL directly. Views point at
// `avatarUrl(userId)`, a path that is stable for the life of the account, and
// the route behind it serves bytes we downloaded and stored ourselves.

export const DEFAULT_AVATAR_SRC = '/icons/favicon-96x96.png';

export const DISCORD_CDN_HOST = 'cdn.discordapp.com';

// Requested from Discord and stored at this size. Large enough for the biggest
// place we render an avatar at 2x, small enough to keep rows a few KB.
export const AVATAR_SIZE = 256;

/**
 * The stable, in-app URL for a user's profile image. Safe to persist in caches,
 * OG tags, and prerendered HTML — it does not expire.
 */
export function avatarUrl(userId?: number | null): string {
  if (!userId || !Number.isInteger(userId) || userId < 1) return DEFAULT_AVATAR_SRC;
  return `/api/avatar/${userId}`;
}

/**
 * Whether a stored `User.image` is a Discord CDN URL we are willing to fetch.
 * `User.image` is only ever written from the Discord OAuth profile, but it
 * reaches a server-side fetch by way of the database, so it gets checked
 * against a host allowlist rather than trusted.
 */
export function isDiscordAvatarSource(src?: string | null): boolean {
  if (!src) return false;

  try {
    const url = new URL(src);
    return url.protocol === 'https:' && url.hostname === DISCORD_CDN_HOST;
  } catch {
    return false;
  }
}

/** Pins the requested dimensions so we are not storing 1024px originals. */
export function sizedAvatarSource(src: string): string {
  const url = new URL(src);
  url.searchParams.set('size', AVATAR_SIZE.toString());
  return url.toString();
}

const avatar = { avatarUrl, isDiscordAvatarSource, sizedAvatarSource };

export default avatar;
