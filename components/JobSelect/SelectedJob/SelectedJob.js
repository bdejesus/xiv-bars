import React from 'react';
import PropTypes from 'prop-types';
import { ROLE_NAMES } from 'data/jobs';
import styles from './styles.module.scss';

function SelectedJob({ job }) {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <img src={`//xivapi.com/${job.Icon}`} alt="" />
      </div>
      <div className={styles.textWrapper}>
        <h1 className={styles.title}>
          <abbr className={styles.abbr}>{ job.Abbr }</abbr>
          <span className={styles.name}>{job.Name}</span>
        </h1>
        <div className={styles.role}>
          {job.Discipline} {job.Role && (`• ${ROLE_NAMES[job.Role]}`)}
        </div>
      </div>
    </div>
  );
}

SelectedJob.propTypes = {
  job: PropTypes.shape().isRequired
};

export default SelectedJob;
