import { promises as fs } from 'fs';
import path from 'path';

// Returns `fallback` when the file is missing or unreadable, so the build can
// bootstrap into an empty `.apiData` directory.
export async function readJson(filePath, fallback = {}) {
  try {
    const contents = await fs.readFile(filePath, 'utf8');
    return contents ? JSON.parse(contents) : fallback;
  } catch {
    return fallback;
  }
}

export async function writeJson(filePath, data, { pretty = false } = {}) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, pretty ? 2 : undefined));
}
