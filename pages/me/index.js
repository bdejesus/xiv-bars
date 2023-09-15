/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useUserDispatch } from 'components/User/context';
import Head from 'next/head';
import I18n from 'lib/I18n/locale/en-US';
import fetch from 'node-fetch';
import GlobalHeader from 'components/GlobalHeader';
import JobMenu from 'components/JobSelect/JobMenu';
import LayoutCard from 'components/LayoutCard';
import Card from 'components/Card';
import Footer from 'components/Footer';
import LoadScreen from 'components/LoadScreen';
import Jobs from '.apiData/Jobs.json';
import { maxLayouts } from 'lib/user';

import styles from './me.module.scss';

export default function Me() {
  const [layouts, setLayouts] = useState();
  const userDispatch = useUserDispatch();
  const { status } = useSession({ required: true });

  function getLayouts() {
    const options = {
      method: 'POST',
      body: JSON.stringify({ method: 'list' }),
      headers: { 'Content-Type': 'application/json' }
    };

    fetch('/api/layout', options)
      .then((data) => data.json())
      .then((json) => setLayouts(json));
  }

  function destroyLayout(layoutId) {
    const options = {
      method: 'POST',
      body: JSON.stringify({ id: layoutId, method: 'destroy' }),
      headers: { 'Content-Type': 'application/json' }
    };
    fetch('/api/layout', options)
      .then((data) => data.json())
      .then((json) => {
        setLayouts(json);
        userDispatch({ type: 'UPDATE_LAYOUTS', layouts: json.length });
      });
  }

  function deleteLayout(e, layoutId) {
    destroyLayout(layoutId);
  }

  useEffect(() => { getLayouts(); }, []);

  if (!layouts || status === 'unauthenticated') return null;

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
        <title>{`${I18n.Pages.Me.my_layouts} • XIVBARS`}</title>
      </Head>

      <GlobalHeader />

      <div className="container section">
        <h1 className="mt-md">
          {I18n.Pages.Me.my_layouts} ({layouts.length ? layouts.length : '-'}/{maxLayouts})
          <a href="/" className={styles.newLink}>
            New Layout
          </a>
        </h1>

        { layouts.length <= 0 && (
          <h2 id="jobSelectTitle">
            {I18n.Pages.Me.no_layouts}
          </h2>
        ) }
      </div>

      { layouts.length > 0
        ? (
          <div className="container section">
            <ul className={styles.layoutsList}>
              {layouts.map((layout) => {
                const job = Jobs.find((j) => j.Abbr === layout.jobId);
                return (
                  <li key={layout.id}>
                    <LayoutCard
                      layout={layout}
                      job={job}
                      onDelete={(e) => deleteLayout(e, layout.id)}
                      className={styles.card}
                    />
                  </li>
                );
              })}

              { [...Array(maxLayouts - layouts.length)].map((e, i) => (
                <li key={`placeholder-${i}`}>
                  <a href="/">
                    <Card className={styles.card}>
                      <h4 className={styles.placeholder}>
                        + New Layout
                      </h4>
                    </Card>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="app-view">
            <div className="container">
              <JobMenu jobs={Jobs} />
            </div>
          </div>
        )}

      <Footer />
      <LoadScreen />
    </>
  );
}
