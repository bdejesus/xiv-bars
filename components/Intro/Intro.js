import React from 'react';
import PropTypes from 'prop-types';
import Header from 'components/Header';
import JobMenu from 'components/JobSelect/JobMenu';
import { JobSelectContextProvider } from 'components/JobSelect/context';

import styles from './Intro.module.scss';

function Intro({ jobs }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Header />
      </div>
      <div className="app-view">
        <div className="container">
          <JobSelectContextProvider>
            <h2 className={styles.title} id="jobSelectTitle">
              Select A Job/Class
            </h2>
            <JobMenu jobs={jobs} />
          </JobSelectContextProvider>
        </div>
      </div>
    </div>
  );
}

Intro.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default Intro;
