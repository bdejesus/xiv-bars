import React, { createRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Xbar from 'components/Xbar';
import Hotbar from 'components/Hotbar';
import Action from 'components/Action';
import JobSelect from 'components/JobSelect';
import Tooltip from 'components/Tooltip';

import styles from './styles.scss';

function XIVBars({
  jobs,
  actions,
  selectedJob
}) {
  const containerEl = createRef();
  const [containerRect, setContainerRect] = useState({});
  const [layout, setLayout] = useState('xbars');

  useEffect(() => {
    const rect = containerEl.current.getBoundingClientRect();
    setContainerRect(rect);
  }, []);

  const ActionsList = actions.map((action) => (
    <li key={`action-${action.ID}`}>
      <Action action={action} />
    </li>
  ));

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

  return (
    <div className={styles.xivBarsContainer} ref={containerEl}>
      <div className="panel">
        <div className={styles.xbarGroup}>

          <div className={styles.buttonContainer}>
            <button
              className={`${styles.button} ${styles.buttonToggle}`}
              type="button"
              onClick={toggleHotbarLayout}
            >
              <span
                className={styles.label}
                data-selected={(layout === 'xbars')}
              >
                WXHB
              </span>
              <span
                className={styles.label}
                data-selected={(layout === 'hotbars')}
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

          <div className={styles.listActions}>
            <ul className={styles.listActions}>{actions && ActionsList}</ul>
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
  selectedJob: PropTypes.shape().isRequired
};

export default XIVBars;
