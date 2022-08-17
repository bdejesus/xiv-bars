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
  const { readOnly, showPublish, showModal } = useAppState();

  return (
    <>
      <div className={styles.controlBar} data-active-modal={showModal}>
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

      <div className={styles.controlContent}>
        { showPublish && <SaveForm /> }
      </div>
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
