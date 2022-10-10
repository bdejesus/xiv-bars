import PropTypes from 'prop-types';
import RoleNames from 'data/RoleNames.json';
import styles from './SelectedJob.module.scss';

export function SelectedJob({ job }) {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <img
          src={job.PreIcon || `//xivapi.com/${job.Icon}`}
          alt=""
          height={36}
          width={36}
        />
      </div>
      <div className={styles.textWrapper}>
        <h2 className={styles.title}>
          <abbr className={styles.abbr}>{job.Abbr}</abbr>
          <span className={styles.name}>{job.Name}</span>
        </h2>
        <div className={styles.role}>
          {job.Discipline} {job.Role && (`• ${RoleNames[job.Role]}`)}
        </div>
      </div>
    </div>
  );
}

SelectedJob.propTypes = {
  job: PropTypes.shape().isRequired
};

export default SelectedJob;
