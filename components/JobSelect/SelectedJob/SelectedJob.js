import React from 'react';
import PropTypes from 'prop-types';
import { ROLE_NAMES } from 'data/jobs';
import styles from './styles.scss';

function SelectedJob({ job }) {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <img src={`//xivapi.com/${job.Icon}`} alt="" />
      </div>
      <div className={styles.textWrapper}>
        <div className={styles.title}>
          <abbr className={styles.abbr}>{ job.Abbr }</abbr>
          <span className={styles.name}>{job.Name}</span>
        </div>
        <div className={styles.role}>{ROLE_NAMES[job.Role]}</div>
      </div>
    </div>
  );
}

SelectedJob.propTypes = {
  job: PropTypes.shape().isRequired
};

export default SelectedJob;
