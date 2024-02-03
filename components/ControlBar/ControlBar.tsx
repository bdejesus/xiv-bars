import { useAppState } from 'components/App/context';
import { useSystemState } from 'components/System';
import LayoutToggle from 'components/UILayout/LayoutToggle';
import PvPToggle from 'components/PvPToggle';
import ToggleTitles from './ToggleTitles';
import ToggleMaxLvl from './ToggleMaxLvl';
import styles from './ControlBar.module.scss';

export function ControlBar() {
  const { readOnly, viewData } = useAppState();
  const { showModal } = useSystemState();

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

          { !readOnly && !viewData.id && (
            <>
              <LayoutToggle />
              <PvPToggle />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ControlBar;
