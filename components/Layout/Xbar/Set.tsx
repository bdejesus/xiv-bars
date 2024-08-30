import Slot from 'components/Slot';
import type { SlotProps } from 'types/Action';
import styles from './Xbar.module.scss';

interface Props {
  slots: SlotProps[]
}

function Set({ slots }: Props) {
  return (
    <div className={styles.set}>
      { slots.map((slot, index) => slot?.id && (
        <Slot
          id={slot.id}
          key={`slot-${slot.id}`}
          action={slot.action}
          className={styles.slot}
          index={index}
        />
      ))}
    </div>
  );
}

export default Set;
