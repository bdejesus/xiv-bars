import React, { useEffect } from 'react';
import db from 'lib/db';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import { translateData } from 'lib/utils/i18n.mjs';
import { useRouter } from 'next/router';
import { domain } from 'lib/host';
import Head from 'next/head';
import App, { useAppDispatch, appActions } from 'components/App';
import GlobalHeader from 'components/GlobalHeader';
import Footer from 'components/Footer';
import Jobs from 'apiData/Jobs.json';
import LayoutsList from 'components/LayoutsList';

import type { ClassJobProps } from 'types/ClassJob';
import type { PageProps } from 'types/Page';
import type { LayoutViewProps } from 'types/Layout';

export default function Index(props:PageProps) {
  const {
    viewData,
    selectedJob,
    actions,
    roleActions,
    viewAction,
    ownerLayouts
  } = props;

  console.log(ownerLayouts);

  const router = useRouter();
  const displayName = translateData('Name', selectedJob, router.locale);
  const displayAbbr = translateData('Abbreviation', selectedJob, router.locale);
  const canonicalUrl = `https://xivbars.bejezus.com/job/${selectedJob.Abbr}/${viewData?.id}`;
  const pageTitle = `${viewData?.title} – ${viewData.user?.name} • ${displayName} (${displayAbbr}) • XIVBARS`;
  const appDispatch = useAppDispatch();

  useEffect(() => {
    appDispatch({
      type: appActions.LOAD_VIEW_DATA,
      payload: {
        viewData,
        selectedJob,
        actions,
        roleActions,
        viewAction,
        urlParams: router.query,
        showDetails: true
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

      <section className='container section'>
        <LayoutsList layouts={ownerLayouts} />
      </section>

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
    if (!selectedJob || selectedJob.Disabled) return { notFound: true };

    const fetchOptions = {
      method: 'POST',
      body: JSON.stringify({ layoutId, method: 'read' }),
      headers: { 'Content-Type': 'application/json' }
    };

    const fetchView = await fetch(`${domain}/api/layout`, fetchOptions);
    const viewData = await fetchView.json();

    console.log(viewData);

    const actionsRequest = await fetch(`${domain}/api/actions?job=${jobId}&isPvp=${viewData.isPvp}`);
    const { actions, roleActions } = await actionsRequest.json();

    const ownerLayouts = await db.layout.findMany({
      where: {
        id: { not: viewData.id },
        userId: viewData.user.id,
        description: { not: '' }
      },
      take: 3,
      include: {
        user: {
          select: { name: true }
        },
        _count: {
          select: { hearts: true }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    const serializableOwnerLayouts = ownerLayouts.map((layout:LayoutViewProps) => ({
      ...layout,
      createdAt: layout?.createdAt?.toString(),
      updatedAt: layout?.updatedAt?.toString()
    }));

    const props = {
      ...(await serverSideTranslations(context.locale as string, ['common'])),
      // Hotfix for parsing the hb column from string to number[]
      viewData: { ...viewData, hb: viewData.hb?.split(',') || null },
      selectedJob,
      actions,
      roleActions,
      viewAction: 'show',
      ownerLayouts: serializableOwnerLayouts
    };


    return { props };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
};
