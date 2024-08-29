import { useAppState } from 'components/App/context';
import { hasActions } from 'lib/xbars';
import { defaultState } from 'components/App/defaultState';
import type { SlotProps } from 'types/Action';
import Row from './Row';
import styles from './Hotbar.module.scss';

export function Hotbar() {
  const {
    viewData, hotbar, readOnly, showTitles
  } = useAppState();
  const hb = viewData?.hb || defaultState.viewData.hb;

  return (
    <ol className={styles.container} data-show-titles={showTitles}>
      {hb && hotbar && Object.keys(hotbar).map((barKey) => {
        const hotbarRow = hotbar[barKey] as SlotProps[];
        return (
          <li key={barKey} className={styles.rowWrapper}>
            { (!readOnly || hasActions(hotbarRow)) && (
              <Row slots={hotbarRow} id={barKey} hb={hb} />
            ) }
          </li>
        );
      })}
    </ol>
  );
}

export default Hotbar;
