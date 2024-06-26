import Image from 'next/image';
import type { ClassJobProps } from 'types/ClassJob';

interface JobSpriteProps {
  job: ClassJobProps
}

export default function JobSprite({ job }:JobSpriteProps) {
  return (
    <Image
      src={`/classjob/sprite-${job.Abbreviation}.png`}
      alt={job.Name}
      height={52}
      width={52}
    />
  );
}
