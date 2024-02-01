import { useAppState } from 'components/App/context';
import { hasActions } from 'lib/xbars';
import type { SlotProps } from 'types/Action';
import Row from './Row';
import styles from './Hotbar.module.scss';

export function Hotbar() {
  const { viewData, hotbar, readOnly } = useAppState();

  return (
    <ol className={styles.container}>
      {viewData.hb && hotbar && Object.keys(hotbar).map((barKey) => {
        const hotbarRow = hotbar[barKey] as SlotProps[];
        return (
          <li key={barKey} className={styles.rowWrapper}>
            { (!readOnly || hasActions(hotbarRow)) && (
              <Row slots={hotbarRow} id={barKey} />
            ) }
          </li>
        );
      })}
    </ol>
  );
}

export default Hotbar;
