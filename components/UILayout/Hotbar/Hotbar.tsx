import { useAppState } from 'components/App/context';
import { hasActions } from 'lib/xbars';
import { SlotProps } from 'types/Action';
import Row from './Row';
import styles from './Hotbar.module.scss';

export function Hotbar() {
  const { hotbar, readOnly } = useAppState();

  return (
    <ol className={styles.container}>
      {hotbar && Object.keys(hotbar).map((barKey) => (
        <li key={barKey} className={styles.rowWrapper}>
          { (!readOnly || hasActions(hotbar[barKey])) && <Row slots={hotbar[barKey] as SlotProps[]} id={barKey} /> }
        </li>
      ))}
    </ol>
  );
}

export default Hotbar;
