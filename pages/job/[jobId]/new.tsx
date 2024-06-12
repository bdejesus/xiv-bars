import React, { useEffect } from 'react';
import db from 'lib/db';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { translateData } from 'lib/utils/i18n.mjs';
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
    viewAction,
    classJobLayouts
  } = props;

  const router = useRouter();
  const displayName = translateData('Name', selectedJob, router.locale);
  const canonicalUrl = `https://www.xivbars.com/job/${selectedJob.Abbr}`;
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
        urlParams: router.query
      }
    });
  }, [viewData]);

  return (
    <>
      <Head>
        <meta name="description" content={t('Pages.Job.new_description', { jobName })} />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      <GlobalHeader selectedJob={selectedJob} />

      <App />

      { classJobLayouts?.length > 0 && (
        <div className="container-xl">
          <LayoutsList
            title={t('Pages.Layout.more_layouts_by_job', { jobName: displayName })}
            link={{ text: t('Pages.Layout.view_more'), href: `/job/${viewData.jobId}` }}
            layouts={classJobLayouts}
            columns={4}
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
  try {
    const { jobId, isPvp } = context.query as ContextQuery;
    const pvp:boolean = !isPvp ? false : isPvp === '1';

    // Get Selected Job
    const selectedJob = jobId ? Jobs.find((job) => job.Abbr === jobId) : null;
    if (!selectedJob || selectedJob.Disabled) return { notFound: true };

    const actionsRequest = await fetch(`${domain}/api/actions?job=${jobId}&isPvp=${pvp}`);
    const { actions, roleActions } = await actionsRequest.json();

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
    const serializableClassJobLayouts = serializeDates(shuffleArray(classJobLayouts).slice(0, 4));

    const props = {
      ...(await serverSideTranslations(context.locale as string, ['common'])),
      viewData: context.query,
      selectedJob,
      actions,
      roleActions,
      viewAction: 'new',
      classJobLayouts: serializableClassJobLayouts
    };

    return { props };
  } catch (error) {
    console.error(error);
    return { props: { error: JSON.stringify(error) } };
  }
};
