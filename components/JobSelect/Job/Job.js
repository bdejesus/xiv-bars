import PropTypes from 'prop-types';

import styles from './Job.module.scss';

export function Job({ job, className }) {
  const jobIconName = job.Icon.toLowerCase().replace('/cj/1/', '');

  return (
    <div className={[styles.wrapper, className].join(' ')}>
      <img
        className={`${styles.icon} job-icon`}
        src={job.PreIcon || `/jobIcons/${jobIconName}`}
        alt={`${job.Name} Icon`}
        draggable={false}
        height={28}
        width={28}
      />
      <b className={`${styles.abbr} job-abbr`}>{job.Abbr}</b>
      &nbsp;
      <span className={`${styles.name} job-name`}>{job.Name}</span>
    </div>
  );
}

Job.propTypes = {
  job: PropTypes.shape().isRequired,
  className: PropTypes.string
};

Job.defaultProps = {
  className: ''
};

export default Job;
