/* eslint-disable react/no-danger */
import PropTypes from 'prop-types';
import ControlBar from 'components/ControlBar';
import ActionPanel from 'components/ActionPanel';
import UILayout from 'components/UILayout';
import Tooltip, { TooltipContextProvider } from 'components/Tooltip';
import { SelectedActionContextProvider } from 'components/SelectedAction';
import { AppContextProvider } from './context';

import styles from './App.module.scss';

function App(props) {
  const {
    jobs,
    selectedJob,
    actions,
    roleActions
  } = props;

  return (
    <AppContextProvider {...props}>
      <TooltipContextProvider>
        <SelectedActionContextProvider>
          <ControlBar jobs={jobs} selectedJob={selectedJob} />

          { selectedJob && (
            <div className="app-view">
              <div className="container">
                <div className={styles.container}>
                  <div className={`panel ${styles.sidebar}`}>
                    <ActionPanel roleActions={roleActions} actions={actions} />
                  </div>

                  <div className={styles.main}>
                    <UILayout />
                  </div>
                </div>

                <Tooltip />
              </div>
            </div>
          )}
        </SelectedActionContextProvider>
      </TooltipContextProvider>
    </AppContextProvider>
  );
}

App.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  roleActions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  selectedJob: PropTypes.shape()
};

App.defaultProps = {
  selectedJob: undefined
};

export default App;
