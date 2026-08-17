// Downloads the framed class/job icons the app serves from `/jobIcons`
// (see components/ClassJob, components/LayoutCard and pages/index).
//
//   yarn build:assets
//
// These rarely change — run it when a new job is added.

import JobsMeta from '../data/JobsMeta.json' with { type: 'json' };
import { paths } from './lib/config.mjs';
import { log, warningCount, progressBar } from './lib/log.mjs';
import { assetUrl, downloadIcons } from './lib/xivapi.mjs';

// Framed 64x64 job icons are at 062100 + the job's ClassJob row id. The 062000
// range holds unframed 56x56 glyphs, which is not what the app renders.
const FRAMED_ICON_OFFSET = 62100;

// The app resolves these as `/jobIcons/${job.Name.replaceAll(' ', '')}.png`.
function jobIcon(job) {
  const iconId = String(FRAMED_ICON_OFFSET + job.ID).padStart(6, '0');

  return {
    url: assetUrl(`ui/icon/062000/${iconId}_hr1.tex`),
    name: `${job.Name.replaceAll(' ', '')}.png`
  };
}

(async () => {
  log(`🎨 Fetching ${JobsMeta.length} job icons into "${paths.jobIcons}"...`);

  const progress = progressBar('job icons', JobsMeta.length);
  await downloadIcons(JobsMeta.map(jobIcon), {
    dir: paths.jobIcons,
    progress
  });
  progress.stop();

  if (warningCount() > 0) {
    log(`\n❌ Finished with ${warningCount()} warning(s).`);
    process.exitCode = 1;
  } else {
    log('\n✅ Done.');
  }
})();
