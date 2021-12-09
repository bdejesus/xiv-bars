/* eslint-disable react/no-danger */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import shortDesc from 'lib/shortDesc';
import I18n from 'lib/I18n/locale/en-US';
import ControlBar from 'components/ControlBar';
import ActionPanel from 'components/ActionPanel';
import UILayout from 'components/UILayout';
import Lore from 'components/Lore';
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
    <AppContextProvider {...props}>
      <TooltipContextProvider>
        <SelectedActionContextProvider>
          <ControlBar jobs={jobs} selectedJob={selectedJob} />

          { selectedJob && (
            <>
              <div className={styles.header}>
                <div className={`container ${styles.headerBody}`}>
                  <h1 className={styles.title}>
                    {selectedJob.Name} {I18n.Global.title}
                  </h1>

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
