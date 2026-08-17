import { promises as fs } from 'fs';
import path from 'path';
import { apiUrl, throttle } from './config.mjs';
import { warn } from './log.mjs';

function sleep(ms) {
  return new Promise((resolve) => { setTimeout(resolve, ms); });
}

export async function fetchJson(endpoint, params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined)
  ).toString();
  const url = `${apiUrl}${endpoint}${query ? `?${query}` : ''}`;

  const response = await fetch(url);
  // Without this the caller reads `.rows` off an error payload and fails much
  // later with a shape error that says nothing about the request.
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} — ${url}`);
  }

  return response.json();
}

export function fetchSheet(sheet, params) {
  return fetchJson(`/sheet/${sheet}`, params);
}

// Game assets are addressed by their path in the game's file tree; `path_hr1`
// is the high-resolution variant of an icon.
export function assetUrl(assetPath) {
  return `${apiUrl}/asset?path=${assetPath}&format=png`;
}

async function downloadIcon({ url, filePath }) {
  const response = await fetch(url, {
    headers: { Accept: 'image/jpeg, image/png, image/webp' }
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} — ${url}`);
  }

  await fs.writeFile(filePath, Buffer.from(await response.arrayBuffer()));
}

// Sequential and throttled by design: this runs over thousands of icons, and
// the directory only needs creating once rather than once per file.
export async function downloadIcons(icons, { dir, progress } = {}) {
  await fs.mkdir(dir, { recursive: true });

  for (const { url, name } of icons) {
    try {
      await downloadIcon({ url, filePath: path.join(dir, name) });
    } catch (error) {
      warn(`Could not fetch icon ${name}`, error);
    }

    progress?.increment();
    await sleep(throttle.betweenIcons);
  }
}
