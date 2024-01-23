import I18n from 'lib/I18n/locale/en-US';
import Hero from 'components/Hero';
import JobMenu from 'components/JobSelect/JobMenu';
import type { ClassJobProps } from 'types/ClassJob';
import styles from './Intro.module.scss';

interface Props {
  jobs: ClassJobProps[],
  className?: string
}

export default function Intro({ jobs, className }: Props) {
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
              <JobMenu />
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

Intro.defaultProps = {
  className: ''
};
