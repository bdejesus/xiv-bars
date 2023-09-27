import Slot from 'components/Slot';
import { SlotType } from 'types/Action';
import styles from './Xbar.module.scss';

interface Props {
  slots: SlotType[]
}

function Set({ slots }: Props) {
  return (
    <div className={styles.set}>
      { slots.map((slot) => (
        <Slot
          id={slot.id}
          key={`slot-${slot.id}`}
          action={slot.action}
          className={styles.slot}
        />
      ))}
    </div>
  );
}

export default Set;
