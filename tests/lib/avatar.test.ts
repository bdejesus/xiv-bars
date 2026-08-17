import {
  avatarUrl,
  isDiscordAvatarSource,
  sizedAvatarSource,
  AVATAR_SIZE,
  DEFAULT_AVATAR_SRC
} from 'lib/avatar';

describe('avatarUrl', () => {
  it('builds a stable path from the user id', () => {
    expect(avatarUrl(42)).toBe('/api/avatar/42');
  });

  it('falls back to the placeholder for a missing or invalid id', () => {
    expect(avatarUrl(undefined)).toBe(DEFAULT_AVATAR_SRC);
    expect(avatarUrl(null)).toBe(DEFAULT_AVATAR_SRC);
    expect(avatarUrl(0)).toBe(DEFAULT_AVATAR_SRC);
    expect(avatarUrl(-1)).toBe(DEFAULT_AVATAR_SRC);
    expect(avatarUrl(1.5)).toBe(DEFAULT_AVATAR_SRC);
  });
});

describe('isDiscordAvatarSource', () => {
  it('accepts an https Discord CDN url', () => {
    expect(isDiscordAvatarSource('https://cdn.discordapp.com/avatars/1/abc.png')).toBe(true);
  });

  it('rejects other hosts, other schemes, and junk', () => {
    expect(isDiscordAvatarSource('https://evil.example.com/avatars/1/abc.png')).toBe(false);
    expect(isDiscordAvatarSource('http://cdn.discordapp.com/avatars/1/abc.png')).toBe(false);
    expect(isDiscordAvatarSource('https://cdn.discordapp.com.evil.example.com/a.png')).toBe(false);
    expect(isDiscordAvatarSource('file:///etc/passwd')).toBe(false);
    expect(isDiscordAvatarSource('http://169.254.169.254/latest/meta-data/')).toBe(false);
    expect(isDiscordAvatarSource('/relative/path.png')).toBe(false);
    expect(isDiscordAvatarSource('')).toBe(false);
    expect(isDiscordAvatarSource(null)).toBe(false);
  });
});

describe('sizedAvatarSource', () => {
  it('pins the requested size', () => {
    expect(sizedAvatarSource('https://cdn.discordapp.com/avatars/1/abc.png'))
      .toBe(`https://cdn.discordapp.com/avatars/1/abc.png?size=${AVATAR_SIZE}`);
  });

  it('overrides a size already on the url', () => {
    expect(sizedAvatarSource('https://cdn.discordapp.com/avatars/1/abc.png?size=1024'))
      .toBe(`https://cdn.discordapp.com/avatars/1/abc.png?size=${AVATAR_SIZE}`);
  });
});
