import React from 'react';
import { GetServerSideProps } from 'next';
import { domain } from 'lib/host';
import {
  listJobActions,
  listRoleActions
} from 'lib/api';
import I18n from 'lib/I18n/locale/en-US';
import shortDesc from 'lib/shortDesc';
import Head from 'next/head';
import { AppContextProvider } from 'components/App/context';
import GlobalHeader from 'components/GlobalHeader';
import Lore from 'components/Lore';
import Footer from 'components/Footer';
import App from 'components/App';
import EorzeaProfile from 'components/EorzeaProfile';
import Jobs from 'apiData/Jobs.json';

import type { ViewProps } from 'types/App';
import type { ClassJobProps } from 'types/ClassJob';
import type { ActionProps } from 'types/Action';

import styles from './params.module.scss';

interface Props {
  selectedJob: ClassJobProps,
  actions: ActionProps[],
  roleActions: ActionProps[],
  viewData: ViewProps,
  viewAction: string
}

export default function Index({
  selectedJob,
  actions,
  roleActions,
  viewData,
  viewAction
}: Props) {
  const { layout, encodedSlots, title } = viewData;
  const readOnly = (viewData && viewAction !== 'edit');
  const pageTitle = `${title} • ${selectedJob.Name} (${selectedJob.Abbr}) Hotbars • XIVBARS`;

  const canonicalUrl = `https://xivbars.bejezus.com/job/${selectedJob.Abbr}/${viewData.id}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={viewData.description} />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      <AppContextProvider
        actions={actions}
        roleActions={roleActions}
        selectedJob={selectedJob}
        layout={layout}
        encodedSlots={encodedSlots}
        readOnly={readOnly}
        viewData={viewData}
        viewAction="show"
      >
        <GlobalHeader />

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
      </AppContextProvider>

      <div className="section">
        <EorzeaProfile />
      </div>

      <Footer />
    </>
  );
}

type ContextParam = string | string[] | undefined;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const id: ContextParam = context.params?.id;
    const params: ContextParam = context.params?.params;
    const [layoutId, viewAction] = params as ContextParam[];

    // Get Selected Job
    const selectedJob = id ? Jobs.find((job: ClassJobProps) => job.Abbr === id) : null;

    const fetchOptions = {
      method: 'POST',
      body: JSON.stringify({ id: layoutId, method: 'read' }),
      headers: { 'Content-Type': 'application/json' }
    };
    const fetchView = await fetch(`${domain}/api/layout`, fetchOptions);
    const viewData = await fetchView.json();

    let jobActions = [];
    let roleActions = [];

    // Fetch Actions
    if (selectedJob) {
      jobActions = await listJobActions(selectedJob);
      // TODO: Refactor this is pull IDS from ClassJob object instead of ROLE_ACTION_IDS
      if (selectedJob.Role) {
        roleActions = await listRoleActions(selectedJob);
      }
    }

    return {
      props: {
        actions: jobActions,
        selectedJob,
        roleActions,
        viewData: {
          ...viewData,
          createdAt: viewData.createdAt.toString(),
          updatedAt: viewData.updatedAt?.toString() || null
        },
        viewAction: viewAction || 'show'
      }
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
};
