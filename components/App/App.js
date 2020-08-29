/* eslint-disable react/no-danger */
import React, { useState, useEffect } from 'react';
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

import styles from './App.styles.module.scss';

function App({
  jobs,
  actions,
  selectedJob,
  roleActions,
  host
}) {
  const [expanded, setExpanded] = useState(true);
  const expandDescStore = 'xivbars_expandDesc';

  useEffect(() => {
    const expandDescription = localStorage.getItem(expandDescStore) === 'true';
    setExpanded(expandDescription);
  }, []);

  function toggleDescription() {
    const expandedState = !expanded;
    localStorage.setItem(expandDescStore, expandedState);
    setExpanded(expandedState);
  }

  return (
    <AppContextProvider actions={actions} roleActions={roleActions} host={host}>
      <TooltipContextProvider>
        <SelectedActionContextProvider>
          { !selectedJob && <Intro jobs={jobs} /> }

          { selectedJob && (
            <>
              <div className={styles.header}>
                <div className={`container ${styles.headerBody}`}>
                  <h1>
                    {selectedJob.Name} {siteData.header.title}
                  </h1>

                  <div className="row">
                    <JobSelectContextProvider>
                      <JobSelect jobs={jobs} selectedJob={selectedJob} />
                    </JobSelectContextProvider>
                  </div>

                  <div
                    className={styles.description}
                    data-expanded={expanded}
                  >
                    <p className={styles.jobDesc}>
                      {shortDesc(selectedJob, actions)}
                    </p>

                    { selectedJob.Description
                      && <Lore selectedJob={selectedJob} /> }
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.toggleButton}
                  data-active={expanded}
                  onClick={toggleDescription}
                >
                  <div className={styles.toggleIcon} />
                </button>
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
                    <div className={styles.main}>
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
  selectedJob: PropTypes.shape(),
  host: PropTypes.string
};

App.defaultProps = {
  selectedJob: undefined,
  host: undefined
};

export default App;
