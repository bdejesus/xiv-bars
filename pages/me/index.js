/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import I18n from 'lib/I18n/locale/en-US';
import fetch from 'node-fetch';
import Link from 'next/link';
import GlobalHeader from 'components/GlobalHeader';
import JobMenu from 'components/JobSelect/JobMenu';
import Job from 'components/JobSelect/Job';
import LoadScreen from 'components/LoadScreen';
import { listJobs, } from 'lib/api';

import styles from './me.module.scss';

export default function Me(pageProps) {
  const { jobs } = pageProps;
  const [layouts, setLayouts] = useState([]);
  const { data: session } = useSession({ required: true });

  useEffect(() => {
    fetch('/api/layouts')
      .then((data) => data.json())
      .then((json) => {
        setLayouts(json);
      });
  }, []);

  function formatDate(date) {
    const formattedDate = new Date(date);
    return formattedDate.toDateString();
  }
  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
        <title>{I18n.Pages.Me.my_layouts} • XIVBARS</title>
      </Head>

      <GlobalHeader />

      { session && session.user && (
        <div className="container section">
          <h1 className="mt-md">
            {I18n.Pages.Me.my_layouts}
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
                    <Link href={`/job/${layout.jobId}/${layout.id}`}>
                      <a className={styles.card}>
                        <h4>
                          {layout.title}
                        </h4>
                        <p className={styles.description}>
                          {layout.description}
                        </p>
                        <div className={styles.cardFooter}>
                          <Job job={job} className={styles.job} />
                          <div className={styles.timestamp}>
                            {I18n.Pages.Me.last_updated}: {formatDate(layout.updatedAt)}
                          </div>
                        </div>
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div className="app-view">
            <div className="container">
              <h2 id="jobSelectTitle">
                {I18n.Pages.Me.no_layouts}
              </h2>
              <JobMenu jobs={jobs} />
            </div>
          </div>
        )}

      <LoadScreen />
    </>
  );
}

Me.getInitialProps = async () => {
  // Get Selected Job
  const decoratedJobs = await listJobs();

  return {
    jobs: decoratedJobs,
  };
};
