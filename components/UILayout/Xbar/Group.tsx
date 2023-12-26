import { sortIntoGroups } from 'lib/utils/array.mjs';
import type { SlotProps } from 'types/Action';
import Set from './Set';

interface Props {
  slots: SlotProps[]
}

function Group({ slots }: Props) {
  const slotSets = sortIntoGroups(slots, 4);

  return (
    <>
      {slotSets.map((slotSet: SlotProps[], index: number) => (
        <Set slots={slotSet} key={`set-${index}`} />
      ))}
    </>
  );
}

export default Group;
