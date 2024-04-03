import React, { useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { listJobActions, listRoleActions } from 'lib/api/actions';
import shortDesc from 'lib/shortDesc';
import GlobalHeader from 'components/GlobalHeader';
import Lore from 'components/Lore';
import HowTo from 'components/HowTo';
import Footer from 'components/Footer';
import App, { AppActions, useAppDispatch } from 'components/App';
// import EorzeaProfile from 'components/EorzeaProfile';
import Jobs from 'apiData/Jobs.json';

import type { PageProps } from 'types/Page';

import styles from '../../Index.module.scss';

export default function Index(props:PageProps) {
  const { t } = useTranslation();
  const {
    viewData,
    selectedJob,
    actions,
    roleActions,
    viewAction
  } = props;
  const router = useRouter();
  const canonicalUrl = `https://xivbars.bejezus.com/job/${selectedJob.Abbr}`;
  const pageDescription = shortDesc(selectedJob);
  const appDispatch = useAppDispatch();

  useEffect(() => {
    appDispatch({
      type: AppActions.LOAD_VIEW_DATA,
      payload: {
        viewData,
        selectedJob,
        actions,
        roleActions,
        viewAction,
        urlParams: router.query
      }
    });
  }, [viewData]);

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
          <h2>{selectedJob.Name} {t('Global.title')}</h2>
          <p className={styles.jobDesc}>
            {shortDesc(selectedJob)}
          </p>
          { selectedJob?.Description && <Lore description={selectedJob.Description} /> }
        </div>
      </div>

      <HowTo />
      {/* <EorzeaProfile /> */}
      <Footer />
    </>
  );
}

type ContextQuery = {
  [key:string]: string | undefined
};

export const getServerSideProps:GetServerSideProps = async (context) => {
  try {
    const { jobId, isPvp } = context.query as ContextQuery;
    const pvp:boolean|undefined = !isPvp ? undefined : isPvp === '1';

    // Get Selected Job
    const selectedJob = jobId ? Jobs.find((job) => job.Abbr === jobId) : null;
    if (!selectedJob) return { notFound: true };

    const jobActions = selectedJob ? await listJobActions(selectedJob, pvp) : [];
    const roleActions = selectedJob ? await listRoleActions(selectedJob, pvp) : [];

    const props = {
      ...(await serverSideTranslations(context.locale as string, ['common'])),
      viewData: context.query,
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
