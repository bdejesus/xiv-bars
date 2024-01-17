import { useAppState } from 'components/App/context';
import LayoutToggle from 'components/UILayout/LayoutToggle';
import ToggleTitles from './ToggleTitles';
import ToggleMaxLvl from './ToggleMaxLvl';
import styles from './ControlBar.module.scss';

export function ControlBar() {
  const { readOnly, showModal } = useAppState();

  return (
    <div className={styles.controlBar} data-active-modal={showModal}>
      <div className={styles.container}>
        <div className={styles.groupLeft}>
          <div className={styles.control}>
            <ToggleTitles />
          </div>

          { !readOnly && (
            <div className={styles.control}>
              <ToggleMaxLvl />
            </div>
          )}

          { !readOnly && (
            <div className={styles.controls}>
              <LayoutToggle />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ControlBar;
