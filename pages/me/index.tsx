/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
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
import Icon, { Icons } from 'components/Icon';
import Jobs from 'apiData/Jobs.json';
import { maxLayouts } from 'lib/user';
import type { ViewDataProps } from 'types/View';
import styles from './me.module.scss';

export default function Me() {
  const initialLayouts:ViewDataProps[] = [];
  const [layouts, setLayouts] = useState(initialLayouts);
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

  function updateLayouts(updatedList:ViewDataProps[]) {
    setLayouts(updatedList);
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
                      afterDelete={(updatedList:ViewDataProps[]) => updateLayouts(updatedList)}
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
                        <Icon id={Icons.ADD} type="white" alt="New Layout Icon" />
                        <span className="btn-layout">New Layout</span>
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
              <JobMenu />
            </div>
          </div>
        )}

      <Footer />
      <LoadScreen />
    </>
  );
}
