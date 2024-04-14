import React, { useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import { translateData } from 'lib/utils/i18n';
import { useRouter } from 'next/router';
import { domain } from 'lib/host';
import {
  listJobActions,
  listRoleActions
} from 'lib/api/actions';
import Head from 'next/head';
import App, { useAppDispatch, AppActions } from 'components/App';
import GlobalHeader from 'components/GlobalHeader';
import Footer from 'components/Footer';
import Jobs from 'apiData/Jobs.json';

import type { ClassJobProps } from 'types/ClassJob';
import type { PageProps } from 'types/Page';

export default function Index(props:PageProps) {
  const {
    viewData,
    selectedJob,
    actions,
    roleActions,
    viewAction
  } = props;

  const router = useRouter();
  const displayName = translateData('Name', selectedJob, router.locale);
  const displayAbbr = translateData('Abbreviation', selectedJob, router.locale);
  const canonicalUrl = `https://xivbars.bejezus.com/job/${selectedJob.Abbr}/${viewData?.id}`;
  const pageTitle = `${viewData?.title} – ${viewData.user?.name} • ${displayName} (${displayAbbr}) • XIVBARS`;
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
        urlParams: router.query,
      }
    });
  }, []);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={viewData?.description} />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      <GlobalHeader selectedJob={selectedJob} />

      <App />

      <Footer />
    </>
  );
}

export const getServerSideProps:GetServerSideProps = async (context) => {
  try {
    const jobId = context.params?.jobId as string;
    const layoutId = context.params?.layoutId as string;

    // Get Selected Job
    const selectedJob = Jobs.find((job: ClassJobProps) => job.Abbr === jobId);
    if (!selectedJob) return { notFound: true };

    const fetchOptions = {
      method: 'POST',
      body: JSON.stringify({ layoutId, method: 'read' }),
      headers: { 'Content-Type': 'application/json' }
    };

    const fetchView = await fetch(`${domain}/api/layout`, fetchOptions);
    const viewData = await fetchView.json();

    const actions = await listJobActions(selectedJob, viewData.isPvp);
    const roleActions = await listRoleActions(selectedJob, viewData.isPvp);

    const props = {
      ...(await serverSideTranslations(context.locale as string, ['common'])),
      // Hotfix for parsing the hb column from string to number[]
      viewData: { ...viewData, hb: viewData.hb?.split(',') || null },
      selectedJob,
      actions,
      roleActions,
      viewAction: 'show'
    };

    return { props };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
};
