import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
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
  const canonicalUrl = `https://xivbars.bejezus.com/job/${selectedJob.Abbr}/${viewData?.id}`;
  const pageTitle = `${viewData?.title} by ${viewData.user?.name} • ${selectedJob.Name} (${selectedJob.Abbr}) Hotbars • XIVBARS`;
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

type ContextParam = string | string[] | undefined;

export const getServerSideProps:GetServerSideProps = async (context) => {
  try {
    const jobId:ContextParam = context.params?.jobId;
    const params:ContextParam = context.params?.params;
    const [layoutId] = params as ContextParam[];

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
    // TODO: Refactor this to pull IDs from ClassJob object instead of ROLE_ACTION_IDS
    const roleActions = selectedJob?.Role ? await listRoleActions(selectedJob) : [];

    const props = {
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
