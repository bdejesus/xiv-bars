/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import PropTypes from 'prop-types';
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

function LayoutCard({ layout, job, onDelete }) {
  function formatDate(date) {
    const formattedDate = new Date(date);
    return formattedDate.toDateString();
  }

  return (
    <Link href={`/job/${layout.jobId}/${layout.id}`}>
      <a className={styles.card}>
        <h4>{layout.title}</h4>

        <p className={styles.description}>{layout.description}</p>

        <div className={styles.cardFooter}>
          <Job job={job} className={styles.job} />
          <div className={styles.timestamp}>
            {I18n.Pages.Me.last_updated}: {formatDate(layout.updatedAt)}
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={onDelete}
            className={styles.removeButton}
          >
            Delete
          </button>
        </div>
      </a>
    </Link>
  );
}

LayoutCard.propTypes = {
  layout: PropTypes.shape().isRequired,
  job: PropTypes.shape().isRequired,
  onDelete: PropTypes.func.isRequired
};

export default function Me(pageProps) {
  const { jobs } = pageProps;
  const [layouts, setLayouts] = useState([]);
  const { status } = useSession({ required: true });

  function getLayouts() {
    const options = {
      method: 'POST',
      body: JSON.stringify({ method: 'list' }),
      headers: { 'Content-Type': 'application/json' }
    };

    fetch('/api/layout', options)
      .then((data) => data.json())
      .then((json) => {
        setLayouts(json);
      });
  }

  function deleteLayout(e, layoutId) {
    e.preventDefault();
    const options = {
      method: 'POST',
      body: JSON.stringify({ id: layoutId, method: 'destroy' }),
      headers: { 'Content-Type': 'application/json' }
    };
    fetch('/api/layout', options).then(() => getLayouts());
  }

  useEffect(() => {
    getLayouts();
  }, []);

  if (status === 'unauthenticated') return null;

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
        <title>{`${I18n.Pages.Me.my_layouts} • XIVBARS`}</title>
      </Head>

      <GlobalHeader />

      <div className="container section">
        <h1 className="mt-md">
          {I18n.Pages.Me.my_layouts}
        </h1>
      </div>

      { layouts.length > 0
        ? (
          <div className="container section">
            <ul className={styles.layoutsList}>
              {layouts.map((layout) => {
                const job = jobs.find((j) => j.Abbr === layout.jobId);
                return (
                  <li key={layout.id}>
                    <LayoutCard
                      layout={layout}
                      job={job}
                      onDelete={(e) => deleteLayout(e, layout.id)}
                    />
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
