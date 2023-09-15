import PropTypes from 'prop-types';
import I18n from 'lib/I18n/locale/en-US';
import Job from '../Job';

import styles from './JobsList.module.scss';

export function JobsList({ title, jobs }) {
  return (
    <div className={styles.group}>
      <h4 className={styles.title}>{title}</h4>
      <ul className={styles.jobList}>
        {jobs.map((job) => (
          <li key={job.Name} value={job.ID}>
            <a href={`/job/${job.Abbr}/layouts`} draggable={false}>
              <Job job={job} />
            </a>
            <a href={`/job/${job.Abbr}`} className={styles.addBtn} title={I18n.JobsList.new_layout}>
              <span className={styles.addBtnLabel}>+</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

JobsList.propTypes = {
  title: PropTypes.string.isRequired,
  jobs: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default JobsList;
