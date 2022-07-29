/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import fetch from 'node-fetch';
import Link from 'next/link';
import GlobalHeader from 'components/GlobalHeader';
import JobMenu from 'components/JobSelect/JobMenu';
import Job from 'components/JobSelect/Job';
import { listJobs, } from 'lib/api';

import styles from './player.module.scss';

export default function Player(pageProps) {
  const { jobs } = pageProps;
  const [layouts, setLayouts] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    fetch('/api/layouts')
      .then((data) => data.json())
      .then((json) => setLayouts(json));
  }, []);

  return (
    <>
      <GlobalHeader />

      { session && session.user && (
        <div className="container section">
          <h1 className="mt-md">
            Saved Layouts
          </h1>
        </div>
      )}

      { layouts.length > 0
        ? (
          <div className="container section">

            <ul className={styles.layoutsList}>
              {layouts.map((layout) => {
                const job = jobs.find((j) => j.Abbr === layout.jobId);

                return (
                  <li key={layout.id}>
                    <div className={styles.card}>
                      <h4>
                        <Link href={`/job/${layout.jobId}/${layout.id}`}>
                          <a>{layout.title}</a>
                        </Link>
                      </h4>
                      <p className={styles.description}>{layout.description}</p>
                      <Job job={job} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div className="app-view">
            <div className="container">
              <h2 id="jobSelectTitle">
                No Layouts – Create a new one?
              </h2>
              <JobMenu jobs={jobs} />
            </div>
          </div>
        )}
    </>
  );
}

Player.getInitialProps = async () => {
  // Get Selected Job
  const decoratedJobs = await listJobs();

  return {
    jobs: decoratedJobs,
  };
};
