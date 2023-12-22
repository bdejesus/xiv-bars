import { sortIntoGroups } from 'lib/utils/array.mjs';
import type { SlotProps } from 'types/Action';
import Set from './Set';

interface Props {
  slots: SlotProps[],
  areaID: string
}

function Group({ slots, areaID }: Props) {
  const slotSets = sortIntoGroups(slots, 4);

  return (
    <>
      {slotSets.map((slotSet: SlotProps[], index: number) => (
        <Set slots={slotSet} key={`${areaID}-set-${index}`} setID={`${areaID}-set-${index}`} />
      ))}
    </>
  );
}

export default Group;
