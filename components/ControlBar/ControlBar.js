import PropTypes from 'prop-types';
import JobSelect, { JobSelectContextProvider } from 'components/JobSelect';
import Sharing from 'components/Sharing';
import ExportToMacros from 'components/ExportToMacro';
import { useAppDispatch, useAppState } from 'components/App/context';
import styles from './ControlBar.module.scss';

function ControlBar({ jobs, selectedJob }) {
  const appDispatch = useAppDispatch();
  const { showTitles, showAllLvl } = useAppState();

  function handleTitlesToggle() {
    appDispatch({ type: 'toggleTitles' });
  }

  function handleMaxLvlToggle() {
    appDispatch({ type: 'toggleAllLvl' });
  }

  const ToggleTitles = () => (
    <button
      type="button"
      onClick={() => handleTitlesToggle()}
      data-active={showTitles}
      className={styles.toggleTitlesBtn}
    >
      <img src="/images/icon-titles.svg" className="btn-icon" alt="Titles Icon" />
      Titles
    </button>
  );

  const ToggleMaxLvl = () => (
    <button
      type="button"
      onClick={() => handleMaxLvlToggle()}
      data-active={showAllLvl}
      className={styles.toggleTitlesBtn}
    >
      <img src="/images/icon-titles.svg" className="btn-icon" alt="Max Lvl Icon" />
      All levels
    </button>
  );

  return (
    <div className={styles.container}>
      <div className={styles.groupLeft}>
        <JobSelectContextProvider>
          <JobSelect jobs={jobs} selectedJob={selectedJob} />
        </JobSelectContextProvider>
      </div>

      <div className={styles.groupRight}>
        <div className={styles.control}>
          <ToggleMaxLvl />
        </div>

        <div className={styles.control}>
          <ToggleTitles />
        </div>

        <div className={styles.control}>
          <ExportToMacros />
        </div>

        <div className={styles.control}>
          <Sharing selectedJob={selectedJob} />
        </div>
      </div>
    </div>
  );
}

ControlBar.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  selectedJob: PropTypes.shape()
};

ControlBar.defaultProps = {
  selectedJob: undefined
};

export default ControlBar;
