import PropTypes from 'prop-types';

import styles from './Job.module.scss';

export function Job({ job }) {
  return (
    <div className={styles.wrapper}>
      <img
        className={styles.icon}
        src={job.PreIcon || `//xivapi.com/${job.Icon}`}
        alt={`${job.Name} Icon`}
        draggable={false}
        height={28}
        width={28}
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
