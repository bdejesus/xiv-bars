import { SlotType } from 'types/Action';
import { useAppState } from 'components/App/context';
import { hotbarKeyPos } from 'lib/xbars';
import Slot from 'components/Slot';
import LayoutControl from './LayoutControl';
import styles from './Hotbar.module.scss';

interface Props {
  slots: SlotType[],
  id: string
}

export default function Row({ slots, id }: Props) {
  const { readOnly, hb } = useAppState();
  const hotbarKey: string = hb[hotbarKeyPos(id) as keyof typeof hb] as string;
  const defaultValue: number = parseInt(hotbarKey, 10);

  return (
    <>
      <ol className={styles.row} data-columns={defaultValue}>
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
          defaultValue={defaultValue}
        />
      )}
    </>
  );
}
