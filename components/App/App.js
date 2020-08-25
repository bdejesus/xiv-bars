/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import shortDesc from 'lib/shortDesc';
import siteData from 'config/app.config';
import ActionPanel from 'components/ActionPanel';
import Intro from 'components/Intro';
import UILayout from 'components/UILayout';
import LayoutToggle from 'components/LayoutToggle';
import Sharing from 'components/Sharing';
import Lore from 'components/Lore';
import JobSelect, { JobSelectContextProvider } from 'components/JobSelect';
import Tooltip, { TooltipContextProvider } from 'components/Tooltip';
import { SelectedActionContextProvider } from 'components/SelectedAction';
import { AppContextProvider } from './context';

import styles from './styles.module.scss';

function App({
  jobs,
  actions,
  selectedJob,
  roleActions
}) {
  return (
    <AppContextProvider actions={actions} roleActions={roleActions}>
      <TooltipContextProvider>
        <SelectedActionContextProvider>
          { !selectedJob && <Intro jobs={jobs} /> }

          { selectedJob && (
            <>
              <div className={styles.header}>
                <div className="container">
                  <h1>
                    {selectedJob.Name} {siteData.header.title}
                  </h1>

                  <div className="row">
                    <JobSelectContextProvider>
                      <JobSelect jobs={jobs} selectedJob={selectedJob} />
                    </JobSelectContextProvider>
                  </div>

                  <div className={styles.description}>
                    <p className={styles.jobDesc}>
                      {shortDesc(selectedJob, actions)}
                    </p>

                    { selectedJob.Description && <Lore selectedJob={selectedJob} /> }
                  </div>
                </div>
              </div>

              <div className={styles.appSection}>
                <div className={styles.appContainer}>
                  <h2 className={styles.sectionTitle}>
                    Plan your { selectedJob && selectedJob.Name } Hotbar Setup
                  </h2>

                  <div className={`${styles.controlPanel} ${styles.container}`}>
                    <Sharing />
                    <LayoutToggle />
                  </div>

                  <div className={`${styles.container} ${styles.appWrapper}`}>
                    <div className={`panel ${styles.sidebar}`}>
                      <ActionPanel roleActions={roleActions} actions={actions} />
                    </div>
                    <div className={`${styles.uiLayout} ${styles.main}`}>
                      <UILayout />
                    </div>
                  </div>
                  <Tooltip />
                </div>
              </div>
            </>
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
