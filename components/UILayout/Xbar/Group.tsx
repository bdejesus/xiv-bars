import { group } from 'lib/utils/array';
import { SlotProps } from 'types/Action';
import Set from './Set';

interface Props {
  slots: SlotProps[]
}

function Group({ slots }: Props) {
  const slotSets = group(slots, 4);

  return (
    <>
      {slotSets.map((groupSlots: SlotProps[], index: number) => (
        <Set slots={groupSlots} key={`set-${index}`} />
      ))}
    </>
  );
}

export default Group;
