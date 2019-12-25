import React, { createRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { generalActions } from 'models/actions';
import HotbarUI from 'components/HotbarUI';
import Action from 'components/Action';
import JobSelect from 'components/JobSelect';
import Tooltip, { TooltipContextProvider } from 'components/Tooltip';
import { SelectedActionContextProvider } from 'components/SelectedAction';
import LoadScreen from 'components/LoadScreen';
import { XIVBarsContextProvider } from './context';

import styles from './styles.scss';

function XIVBars({
  jobs,
  actions,
  selectedJob,
  roleActions
}) {
  const containerEl = createRef();
  const [containerRect, setContainerRect] = useState({});

  useEffect(() => {
    const rect = containerEl.current.getBoundingClientRect();
    setContainerRect(rect);
  }, []);

  function ActionsList() {
    return actions.map((action) => (
      <li key={`action-${action.ID}`}>
        <Action action={action} />
      </li>
    ));
  }

  function GeneralActions() {
    return generalActions.map((action) => (
      <li key={`action-${action.ID}`}>
        <Action action={action} />
      </li>
    ));
  }

  function RoleActions() {
    return roleActions.map((action) => (
      <li key={`action-${action.ID}`}>
        <Action action={action} />
      </li>
    ));
  }

  return (
    <TooltipContextProvider>
      <SelectedActionContextProvider>
        <div className={styles.xivBarsContainer} ref={containerEl}>
          <LoadScreen />

          <div className="panel">
            <div className={styles.xbarGroup}>
              <XIVBarsContextProvider actions={actions}>
                <HotbarUI />
              </XIVBarsContextProvider>
            </div>

            <div className={styles.panel}>
              <div className="content-layout content-middle">
                <div className="content-main">
                  {jobs && <JobSelect jobs={jobs} selectedJob={selectedJob} />}
                </div>
              </div>

              <div>
                <ul className={styles.listActions}>{actions && <ActionsList />}</ul>
              </div>

              {(roleActions && roleActions.length) > 0 && (
              <div>
                <h4 className={styles.sectionTitle}>Role Actions</h4>
                <ul className={styles.listActions}>
                  <RoleActions />
                </ul>
              </div>
              )}

              <div>
                <h4 className={styles.sectionTitle}>General Actions</h4>
                <ul className={styles.listActions}>
                  <GeneralActions />
                </ul>
              </div>
            </div>
          </div>

          <Tooltip container={containerRect} />
        </div>
      </SelectedActionContextProvider>
    </TooltipContextProvider>
  );
}

XIVBars.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  selectedJob: PropTypes.shape().isRequired,
  roleActions: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default XIVBars;
