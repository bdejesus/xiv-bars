import React, { useEffect } from 'react';
import db from 'lib/db';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { translateData } from 'lib/utils/i18n.mjs';
import * as Sentry from '@sentry/nextjs';
import { serializeDates, shuffleArray } from 'lib/utils/array.mjs';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { domain } from 'lib/host';
import GlobalHeader from 'components/GlobalHeader';
import Lore from 'components/Lore';
import HowTo from 'components/HowTo';
import Footer from 'components/Footer';
import App, { appActions, useAppDispatch } from 'components/App';
import LayoutsList from 'components/LayoutsList';
import EorzeaProfile from 'components/EorzeaProfile';
import { hasSprite } from 'components/JobSprite';
import Jobs from 'apiData/Jobs.json';

import type { PageProps } from 'types/Page';
import type { ClassJobProps } from 'types/ClassJob';

import styles from '../../Index.module.scss';

export default function Index(props:PageProps) {
  const { t } = useTranslation();
  const {
    viewData,
    selectedJob,
    actions,
    roleActions,
    viewAction,
    classJobLayouts,
    parentLayout
  } = props;

  const router = useRouter();
  const displayName = translateData('Name', selectedJob, router.locale);
  const appDispatch = useAppDispatch();
  const jobName = translateData('Name', selectedJob, router.locale);

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
        parentLayout
      }
    });
  }, [viewData]);

  return (
    <>
      <Head>
        <title>
          {`${t('Pages.Layout.new_title', { jobName })} | XIVBARS`}
        </title>

        <meta name="description" content={t('Pages.Job.new_description', { jobName })} />
        { hasSprite(selectedJob) && (
          <meta property="og:image" content={`${domain}/classjob/sprite-${selectedJob.Abbr}@2x.png`} />
        )}
      </Head>

      <GlobalHeader selectedJob={selectedJob} />

      <App />

      { classJobLayouts?.length > 0 && (
        <div className="container">
          <LayoutsList
            id="jobLayouts"
            title={t('Pages.Layout.more_layouts_by_job', { jobName: displayName })}
            link={{ text: t('Pages.Layout.view_more'), href: `/job/${viewData.jobId}` }}
            layouts={classJobLayouts}
            columns={3}
          />
        </div>
      ) }

      <div className="container">
        <div className={styles.description}>
          <h2>{jobName} {t('Global.title')}</h2>
          { selectedJob?.Description && <Lore description={selectedJob.Description} /> }
        </div>
      </div>

      <HowTo />
      <EorzeaProfile />
      <Footer />
    </>
  );
}

type ContextQuery = {
  [key:string]: string | undefined
};

export const getServerSideProps:GetServerSideProps = async (context) => {
  const { jobId, isPvp, id } = context.query as ContextQuery;

  const pvp:boolean = !isPvp ? false : isPvp === '1';

  let parentLayout;

  if (id) {
    const fetchOptions = {
      method: 'POST',
      body: JSON.stringify({ layoutId: id, viewerId: undefined, method: 'read' }),
      headers: { 'Content-Type': 'application/json' }
    };

    parentLayout = await fetch(`${domain}/api/layout`, fetchOptions);
    parentLayout = await parentLayout.json();
  }

  // Get Selected Job
  const selectedJob = jobId ? Jobs.find((job:ClassJobProps) => job.Abbr === jobId) : null;
  if (!selectedJob) return { notFound: true };

  const actionsRequest = await fetch(`${domain}/api/actions?job=${jobId}&isPvp=${pvp}`);
  const { actions, roleActions } = await actionsRequest.json();

  try {
    // DB Query to fetch other layouts with the same jobClass
    const classJobLayouts = await db.layout.findMany({
      take: 24,
      where: {
        description: { not: '' },
        jobId: selectedJob.Abbr
      },
      include: {
        user: { select: { name: true } },
        _count: { select: { hearts: true } }
      },
      orderBy: { updatedAt: 'desc' }
    });
    // Take results, shuffle and take 4, convert date objects to json string
    const serializableClassJobLayouts = serializeDates(shuffleArray(classJobLayouts).slice(0, 12));

    const props = {
      ...(await serverSideTranslations(context.locale as string, ['common'])),
      viewData: context.query,
      selectedJob,
      actions,
      roleActions,
      viewAction: 'new',
      classJobLayouts: serializableClassJobLayouts,
      parentLayout
    };

    return { props };
  } catch (error) {
    Sentry.captureException(error);

    const props = {
      ...(await serverSideTranslations(context.locale as string, ['common'])),
      viewData: context.query,
      selectedJob,
      actions,
      roleActions,
      viewAction: 'new',
      classJobLayouts: [],
      parentLayout
    };

    return { props };
  }
};
