/* eslint-disable react/no-danger */
import { useState } from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';
import ActionPanel from 'components/ActionPanel';
import UILayout from 'components/UILayout';
import Sharing from 'components/Sharing';
import ExportToMacros from 'components/ExportToMacro';

import JobSelect, { JobSelectContextProvider } from 'components/JobSelect';
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
  const [displayHelp, setDisplayHelp] = useState(false);

  return (
    <AppContextProvider {...props}>
      <TooltipContextProvider>
        <SelectedActionContextProvider>
          <div className={styles.wrapper}>
            <div className={styles.controlBar}>
              <div className={`${styles.controlsContainer} container-lg`}>
                <div className={styles.sidebar}>
                  <JobSelectContextProvider>
                    <JobSelect jobs={jobs} selectedJob={selectedJob} />
                  </JobSelectContextProvider>
                </div>

                <div className={[styles.controlGroup, styles.pageActions].join(' ')}>
                  <div className={styles.control}>
                    <button
                      type="button"
                      onClick={() => setDisplayHelp(!displayHelp)}
                      data-active={displayHelp}
                    >
                      <Image
                        src="/images/icon-titles.svg"
                        className="icon"
                        alt="Titles Icon"
                        height={26}
                        width={26}
                      />
                      Titles
                    </button>
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

            <div className={`app-view container-lg ${styles.app}`} data-help={displayHelp}>
              <div className={styles.container}>
                <div className={styles.sidebar}>
                  <ActionPanel roleActions={roleActions} actions={actions} />
                </div>

                <div className={styles.main}>
                  <UILayout />
                </div>
              </div>

              <Tooltip />
            </div>
          </div>

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
