import { useEffect, useState } from 'react';
import { useAppState } from 'components/App/context';
import { useSystemState } from 'components/System';
import LayoutToggle from 'components/UILayout/LayoutToggle';
import PvPToggle from 'components/PvPToggle';
import ToggleTitles from './ToggleTitles';
import ToggleMaxLvl from './ToggleMaxLvl';
import styles from './ControlBar.module.scss';

export function ControlBar() {
  const { readOnly, viewData, selectedJob } = useAppState();
  const [showPvpToggle, setShowPvpToggle] = useState(false);
  const { showModal } = useSystemState();

  useEffect(() => {
    if (selectedJob) setShowPvpToggle(['DOW', 'DOM'].includes(selectedJob.Discipline));
  }, [selectedJob]);

  return (
    <div className={styles.controlBar} data-active-modal={showModal}>
      <div className={styles.container}>
        <div className={styles.groupLeft}>
          <div className={styles.control}>
            <ToggleTitles />
          </div>

          { !readOnly && (
          <>
            <div className={styles.control}><ToggleMaxLvl /></div>

            { !viewData.id && (
              <>
                <LayoutToggle />
                { showPvpToggle && <PvPToggle /> }
              </>
            )}
          </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ControlBar;
