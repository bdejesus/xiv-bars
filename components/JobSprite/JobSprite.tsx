import Image from 'next/image';
import type { ClassJobProps } from 'types/ClassJob';

interface JobSpriteProps {
  job: ClassJobProps,
  className?: string
}

export function hasSprite(job:ClassJobProps) {
  const checkJob = (job && job.Abbr)
    && ['DOW', 'DOM'].includes(job.Discipline)
    && !['BLU'].includes(job.Abbr);
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
