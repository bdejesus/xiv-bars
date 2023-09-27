import { SlotType } from 'types/Action';
import Group from './Group';
import styles from './Xbar.module.scss';

interface Props {
  bar: SlotType[]
}

export default function Bar({ bar }: Props) {
  const barGroups = {
    left: bar.slice(0, 8),
    right: bar.slice(8, bar.length + 1)
  };

  return (
    <>
      {Object.keys(barGroups).map((slotGroup: string, index: number) => (
        <div className={`${styles[slotGroup]} ${slotGroup}`} key={`group-${index}`}>
          <Group slots={barGroups[slotGroup as keyof typeof barGroups]} />
        </div>
      ))}
    </>
  );
}
