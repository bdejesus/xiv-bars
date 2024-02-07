import type { SlotProps } from 'types/Action';
import { useAppState } from 'components/App/context';
import { hotbarKeyPosition } from 'lib/xbars';
import Slot from 'components/Slot';
import LayoutControl from './LayoutControl';
import styles from './Hotbar.module.scss';

interface Props {
  slots: SlotProps[],
  id: string,
  hb: number[]
}

export default function Row({ slots, id, hb }: Props) {
  const { readOnly } = useAppState();
  if (!hb || !slots) return null;

  // console.log(hb, id);
  const hotbarKey = hb[hotbarKeyPosition(id)].toString();

  return (
    <>
      <ol className={styles.row} data-columns={hotbarKey}>
        {Object.keys(slots).map((slot: string) => {
          const slotItem = slots[parseInt(slot, 10)];
          return (
            <li key={`slot-${slotItem.id}`}>
              <Slot id={slotItem.id} action={slotItem.action} className={styles.slot} />
            </li>
          );
        })}
      </ol>

      { !readOnly && (
        <LayoutControl
          id={id}
          defaultValue={hotbarKey}
        />
      )}
    </>
  );
}
