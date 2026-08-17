/* eslint-disable no-console */
import cliProgress from 'cli-progress';
import colors from 'ansi-colors';

export function log(message) {
  console.log(message);
}

// Failures are reported and the build carries on — a missing icon should not
// cost you the other 3,000. `build_data` exits non-zero if anything warned.
let warnings = 0;

export function warn(message, error) {
  warnings += 1;
  console.error(`⚠️  ${message}${error ? `: ${error.message ?? error}` : ''}`);
}

export function warningCount() {
  return warnings;
}

export function progressBar(label, total) {
  const bar = new cliProgress.SingleBar({
    format: `  🧱 Fetching ${colors.yellowBright(label)} ${colors.yellowBright('[{bar}]')} {value}/{total} | {percentage}% `,
    barsize: 10
  }, cliProgress.Presets.rect);

  bar.start(total, 0);
  return bar;
}
