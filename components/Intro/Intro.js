import PropTypes from 'prop-types';
import Hero from 'components/Hero';
import JobMenu from 'components/JobSelect/JobMenu';

import styles from './Intro.module.scss';

export function Intro({ jobs }) {
  return (
    <>
      <div className={styles.header}>
        <Hero />
      </div>

      <div className="app-view">
        <div className="container">
          <h2 className={styles.title} id="jobSelectTitle">
            Select A Job/Class
          </h2>
          <JobMenu jobs={jobs} />
        </div>
      </div>
    </>
  );
}

Intro.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default Intro;
