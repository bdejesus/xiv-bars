/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useUserDispatch } from 'components/User/context';
import Head from 'next/head';
import Link from 'next/link';
import I18n from 'lib/I18n/locale/en-US';
import { AppContextProvider } from 'components/App/context';
import GlobalHeader from 'components/GlobalHeader';
import JobMenu from 'components/JobSelect/JobMenu';
import LayoutCard from 'components/LayoutCard';
import Card from 'components/Card';
import Footer from 'components/Footer';
import LoadScreen from 'components/LoadScreen';
import Icon from 'components/Icon';
import Jobs from 'apiData/Jobs.json';
import { maxLayouts } from 'lib/user';
import { UserActions } from 'components/User/actions';
import type { LayoutProps } from 'types/Layout';
import styles from './me.module.scss';

export default function Me() {
  const initialLayouts: LayoutProps[] = [];
  const [layouts, setLayouts] = useState(initialLayouts);
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

  function destroyLayout(layoutId: number) {
    const options = {
      method: 'POST',
      body: JSON.stringify({ id: layoutId, method: 'destroy' }),
      headers: { 'Content-Type': 'application/json' }
    };
    fetch('/api/layout', options)
      .then((data) => data.json())
      .then((json) => {
        setLayouts(json);
        userDispatch({ type: UserActions.UPDATE_LAYOUTS, payload: { layouts: json.length } });
      });
  }

  function deleteLayout(layoutId: number) {
    destroyLayout(layoutId);
  }

  useEffect(() => { getLayouts(); }, []);

  if (!layouts || status !== 'authenticated') return null;

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
        <title>{`${I18n.Pages.Me.my_layouts} • XIVBARS`}</title>
      </Head>

      <AppContextProvider>
        <GlobalHeader />
      </AppContextProvider>

      <div className="container section">
        <h1 className="mt-md">
          {I18n.Pages.Me.my_layouts} ({layouts.length ? layouts.length : '-'}/{maxLayouts})
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
                if (!job) return null;
                return (
                  <li key={layout.id}>
                    <LayoutCard
                      layout={layout}
                      job={job}
                      onDelete={() => deleteLayout(layout.id)}
                      className={styles.card}
                      hideName={false}
                    />
                  </li>
                );
              })}

              { layouts.length < maxLayouts && (
                <li>
                  <Link href="/">
                    <Card className={[styles.card, styles.newCard].join(' ')}>
                      <h4 className={styles.placeholder}>
                        <Icon id="add" type="white" title="New Layout Icon" />
                        New Layout
                      </h4>
                    </Card>
                  </Link>
                </li>
              )}
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
