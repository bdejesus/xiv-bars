import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

function Job({ job }) {
  return (
    <div className={styles.wrapper}>
      <img
        className={styles.icon}
        src={`//xivapi.com/${job.Icon}`}
        alt={`${job.Name} Icon`}
        draggable={false}
      />
      <b className={styles.abbr}>{job.Abbr}</b>
      &nbsp;
      <span className={styles.name}>{job.Name}</span>
    </div>
  );
}

Job.propTypes = {
  job: PropTypes.shape().isRequired
};

export default Job;
