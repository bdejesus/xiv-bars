import PropTypes from 'prop-types';
import I18n from 'lib/I18n/locale/en-US';
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
                { I18n.Intro.select_a_job }
              </h2>
              <JobMenu jobs={jobs} />
            </>
          ) : (
            <div className="system-message error">
              { I18n.Error.no_jobs }
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
