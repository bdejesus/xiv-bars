import Hero from 'components/Hero';
import JobMenu from 'components/JobSelect/JobMenu';
import { jobsType } from 'lib/types/jobs';
import styles from './Intro.module.scss';

export function Intro({ jobs }) {
  return (
    <>
      <div className={styles.header}>
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
  jobs: jobsType.isRequired
};

export default Intro;
