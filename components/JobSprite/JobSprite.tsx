import Image from 'next/image';
import type { ClassJobProps } from 'types/ClassJob';

interface JobSpriteProps {
  job: ClassJobProps,
  className?: string
}

// The sprites are hand-drawn, so a job only has one once the art exists —
// the limited jobs are still waiting on theirs.
const MISSING_SPRITES = ['BLU', 'BST'];

export function hasSprite(job:ClassJobProps) {
  const checkJob = (job && job.Abbr)
    && ['DOW', 'DOM'].includes(job.Discipline)
    && !MISSING_SPRITES.includes(job.Abbr);
  return checkJob;
}

export default function JobSprite({ job, className = '' }:JobSpriteProps) {
  return (
    <div className={className}>
      <Image
        src={`/classjob/sprite-${job.Abbreviation}.png`}
        alt={job.Name}
        height={52}
        width={52}
      />
    </div>
  );
}
