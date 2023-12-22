import Slot from 'components/Slot';
import type { SlotProps } from 'types/Action';
import styles from './Xbar.module.scss';

interface Props {
  slots: SlotProps[]
  setID: string
}

function Set({ slots, setID }: Props) {
  return (
    <div className={styles.set} id={`${setID}`}>
      { slots.map((slot) => slot?.id && (
        <>
          {/* { console.log(`${setID}-slot-${slot.id}`) } */}

          <Slot
            id={slot.id}
            key={`${setID}-slot-${slot.id}`}
            action={slot.action}
            className={styles.slot}
          />
        </>
      ))}
    </div>
  );
}

export default Set;
