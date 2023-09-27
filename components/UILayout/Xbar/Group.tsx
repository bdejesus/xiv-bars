import { group } from 'lib/utils/array';
import { SlotType } from 'types/Action';
import Set from './Set';

interface Props {
  slots: SlotType[]
}

function Group({ slots }: Props) {
  const slotSets = group(slots, 4);

  return (
    <>
      {slotSets.map((groupSlots: SlotType[], index: number) => (
        <Set slots={groupSlots} key={`set-${index}`} />
      ))}
    </>
  );
}

export default Group;
