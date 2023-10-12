import { sortIntoGroups } from 'lib/utils/array.mjs';
import { SlotProps } from 'types/Action';
import Set from './Set';

interface Props {
  slots: SlotProps[]
}

function Group({ slots }: Props) {
  const slotSets = sortIntoGroups(slots, 4);

  return (
    <>
      {slotSets.map((groupSlots: SlotProps[], index: number) => (
        <Set slots={groupSlots} key={`set-${index}`} />
      ))}
    </>
  );
}

export default Group;
