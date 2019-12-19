import React, { createRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Xbar from 'components/Xbar';
import Hotbar from 'components/Hotbar';
import Action from 'components/Action';
import JobSelect from 'components/JobSelect';
import Tooltip from 'components/Tooltip';
import { generalActions } from 'models/actions';
import LoadingSpinner from 'components/LoadingSpinner';
import Router from 'next/router';

import styles from './styles.scss';

function XIVBars({
  jobs,
  actions,
  selectedJob,
  roleActions
}) {
  const containerEl = createRef();
  const [isLoading, setIsLoading] = useState(false);
  const [containerRect, setContainerRect] = useState({});
  const [layout, setLayout] = useState('xbars');

  Router.events.on('routeChangeStart', () => setIsLoading(true));
  Router.events.on('routeChangeComplete', () => setIsLoading(false));
  Router.events.on('routeChangeError', () => console.log('error'));

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

  function toggleHotbarLayout() {
    if (layout === 'xbars') {
      setLayout('hotbars');
    } else {
      setLayout('xbars');
    }
  }

  function HotbarLayout() {
    if (layout === 'xbars') {
      return <Xbar />;
    }
    return <Hotbar />;
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
    <div className={styles.xivBarsContainer} ref={containerEl}>
      {isLoading && <LoadingSpinner />}

      <div className="panel">
        <div className={styles.xbarGroup}>
          <div className={styles.buttonContainer}>
            <button
              className={`${styles.button} ${styles.buttonToggle}`}
              type="button"
              onClick={toggleHotbarLayout}
            >
              <span className={styles.label} data-selected={layout === 'xbars'}>
                WXHB
              </span>
              <span
                className={styles.label}
                data-selected={layout === 'hotbars'}
              >
                Hotbars
              </span>
            </button>
          </div>

          <HotbarLayout />
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

          {roleActions.length > 0 && (
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
  );
}

XIVBars.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  selectedJob: PropTypes.shape().isRequired,
  roleActions: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default XIVBars;
