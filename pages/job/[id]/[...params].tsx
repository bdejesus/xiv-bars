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

import type { ViewDataProps } from 'types/App';
import type { ClassJobProps } from 'types/ClassJob';
import type { ActionProps } from 'types/Action';

import styles from './params.module.scss';

interface ViewProps extends ViewDataProps {
  selectedJob: ClassJobProps,
  actions: ActionProps[],
  roleActions: ActionProps[],
  viewAction: string
}

export default function Index({
  selectedJob,
  actions,
  roleActions,
  layout,
  encodedSlots,
  title,
  user,
  hb,
  xhb,
  wxhb,
  exhb,
  description,
  viewAction,
  layoutId,
  userId
}:ViewProps) {
  const formatHb = hb ? JSON.parse(hb) : undefined;
  const readOnly = (viewAction !== 'edit');
  const pageTitle = `${title} • ${selectedJob.Name} (${selectedJob.Abbr}) Hotbars • XIVBARS`;
  const canonicalUrl = `https://xivbars.bejezus.com/job/${selectedJob.Abbr}/${layoutId}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      <AppContextProvider
        actions={actions}
        roleActions={roleActions}
        selectedJob={selectedJob}
        layout={layout}
        readOnly={readOnly}
        user={user}
        userId={userId}
        viewAction="show"
        hb={formatHb}
        xhb={xhb}
        wxhb={wxhb}
        exhb={exhb}
        layoutId={layoutId}
        title={title}
        description={description}
        encodedSlots={encodedSlots}
      >
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
      body: JSON.stringify({ layoutId, method: 'read' }),
      headers: { 'Content-Type': 'application/json' }
    };

    const fetchView = await fetch(`${domain}/api/layout`, fetchOptions);
    const viewData = await fetchView.json();

    let jobActions = [];
    let roleActions = [];

    // Fetch Actions
    if (selectedJob) {
      jobActions = await listJobActions(selectedJob);
      // TODO: Refactor this to pull IDs from ClassJob object instead of ROLE_ACTION_IDS
      if (selectedJob.Role) {
        roleActions = await listRoleActions(selectedJob);
      }
    }

    return {
      props: {
        ...viewData,
        actions: jobActions,
        selectedJob,
        roleActions,
        layoutId: viewData.id || undefined,
        createdAt: viewData.createdAt?.toString() || null,
        updatedAt: viewData.updatedAt?.toString() || null,
        viewAction: viewAction || 'show'
      }
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
};
