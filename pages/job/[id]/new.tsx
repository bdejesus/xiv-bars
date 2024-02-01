import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  listJobActions,
  listRoleActions
} from 'lib/api';
import shortDesc from 'lib/shortDesc';
import I18n from 'lib/I18n/locale/en-US';
import GlobalHeader from 'components/GlobalHeader';
import Hero from 'components/Hero';
import Lore from 'components/Lore';
import HowTo from 'components/HowTo';
import Footer from 'components/Footer';
import App, { AppActions, useAppDispatch } from 'components/App';
import { defaultState as defaultAppState } from 'components/App/defaultState';
import EorzeaProfile from 'components/EorzeaProfile';
import Jobs from 'apiData/Jobs.json';

import type { PageProps } from 'types/Page';

import styles from '../../Index.module.scss';

export default function Index(props:PageProps) {
  const {
    selectedJob,
    actions,
    roleActions,
    viewAction
  } = props;
  const router = useRouter();
  const canonicalUrl = `https://xivbars.bejezus.com/job/${selectedJob.Abbr}`;
  const pageDescription = shortDesc(selectedJob, actions);
  const appDispatch = useAppDispatch();

  useEffect(() => {
    appDispatch({
      type: AppActions.LOAD_VIEW_DATA,
      payload: {
        viewData: defaultAppState.viewData,
        selectedJob,
        actions,
        roleActions,
        viewAction,
        urlParams: router.query
      }
    });
  }, [props]);

  return (
    <>
      <Head>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      <GlobalHeader selectedJob={selectedJob} />

      <App />

      <div className="container section">
        <div className={styles.description}>
          <h2>{selectedJob.Name} {I18n.Global.title}</h2>
          <p className={styles.jobDesc}>
            {shortDesc(selectedJob, actions)}
          </p>

          { selectedJob.Description && <Lore selectedJob={selectedJob} /> }
        </div>
      </div>

      <div className={styles.articles}>
        {(selectedJob) && <Hero primary={(!selectedJob)} />}
        <HowTo />
        <EorzeaProfile />
      </div>

      <Footer />
    </>
  );
}

type ContextParam = string | string[] | undefined;

export const getServerSideProps:GetServerSideProps = async (context) => {
  try {
    const id:ContextParam = context.query?.id;
    const pvp = context.query?.pvp === '1';

    // Get Selected Job
    const selectedJob = id
      ? Jobs.find((job) => job.Abbr === id)
      : null;
    if (!selectedJob) return { notFound: true };

    const jobActions = selectedJob ? await listJobActions(selectedJob, pvp) : [];
    // TODO: Refactor this is pull IDS from ClassJob object instead of ROLE_ACTION_IDS
    const roleActions = selectedJob?.Role ? await listRoleActions(selectedJob) : [];

    const props = {
      viewData: null,
      selectedJob,
      actions: jobActions,
      roleActions,
      viewAction: 'new'
    };

    return { props };
  } catch (error) {
    console.error(error);
    return { props: { error: JSON.stringify(error) } };
  }
};
