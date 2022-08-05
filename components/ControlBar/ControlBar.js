import PropTypes from 'prop-types';
import { useAppState } from 'components/App/context';
import Sharing from 'components/Sharing';
import ExportToMacros from 'components/ExportToMacro';
import SaveForm from 'components/SaveForm';
import ToggleTitles from './ToggleTitles';
import ToggleMaxLvl from './ToggleMaxLvl';
import ToggleSaveForm from './ToggleSaveForm';
import styles from './ControlBar.module.scss';

export function ControlBar({ selectedJob }) {
  const { readOnly, showPublish } = useAppState();

  return (
    <>
      <div className={styles.controlBar}>
        <div className={styles.container}>
          <div className={styles.groupRight}>
            { !readOnly && (
              <div className={styles.control}>
                <ToggleMaxLvl />
              </div>
            )}

            <div className={styles.control}>
              <ToggleTitles />
            </div>
          </div>

          <div className={styles.groupRight}>
            <div className={styles.control}>
              <ToggleSaveForm />
            </div>

            <div className={styles.control}>
              <ExportToMacros />
            </div>

            <div className={styles.control}>
              <Sharing selectedJob={selectedJob} />
            </div>
          </div>
        </div>
      </div>

      { showPublish && <SaveForm /> }
    </>
  );
}

ControlBar.propTypes = {
  selectedJob: PropTypes.shape()
};

ControlBar.defaultProps = {
  selectedJob: undefined
};

export default ControlBar;
