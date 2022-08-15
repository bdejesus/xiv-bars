import PropTypes from 'prop-types';
import Hero from 'components/Hero';
import JobMenu from 'components/JobSelect/JobMenu';
import { jobsType } from 'lib/types/jobs';
import styles from './Intro.module.scss';

export function Intro({ jobs, className }) {
  return (
    <>
      <div className={[styles.header, className].join(' ')}>
        <Hero />
      </div>

      <div className="app-view">
        <div className="container">
          { jobs.length > 0 ? (
            <>
              <h2 className={styles.title} id="jobSelectTitle">
                Select A Job/Class
              </h2>
              <JobMenu jobs={jobs} />
            </>
          ) : (
            <div className="system-message error">
              Something went wrong and we couldn’t load any <code>jobs</code> data. Please try again later.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

Intro.propTypes = {
  jobs: jobsType.isRequired,
  className: PropTypes.string
};

Intro.defaultProps = {
  className: undefined
};

export default Intro;
