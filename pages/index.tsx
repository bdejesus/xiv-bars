import React, { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import * as Sentry from '@sentry/nextjs';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import db, { serializeDates } from 'lib/db';
import { localizePath, translateData } from 'lib/utils/i18n.mjs';
import { AppContextProvider } from 'components/App/context';
import GlobalHeader from 'components/GlobalHeader';
import HowTo from 'components/HowTo';
import Hero from 'components/Hero';
import JobMenu from 'components/JobSelect/JobMenu';
import Footer from 'components/Footer';
import LayoutsList from 'components/LayoutsList';
import Jobs from 'apiData/Jobs.json';
import dynamic from 'next/dynamic';
import renderMeta from 'components/Meta';

import type { GetServerSideProps } from 'next';
import type { LayoutViewProps } from 'types/Layout';
import type { ClassJobProps } from 'types/ClassJob';

import styles from './Index.module.scss';

const AdUnit = dynamic(() => import('components/AdUnit'), { ssr: false });

interface QueryProps {
  job?: string,
  s1?: string,
  s?: string
}

interface IndexProps {
  recentLayouts: LayoutViewProps[],
  popularLayoutsByJob: {
    job: ClassJobProps,
    layouts: LayoutViewProps[]
  }[]
}

export default function Index({ recentLayouts, popularLayoutsByJob }:IndexProps) {
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const jobAbbrs = Jobs.map(({ Abbr }) => Abbr);
    // `s` param is deprecated but is there to provide backward support
    // for an earlier format of the encodedSlots
    const { job, s1, s } = router.query as QueryProps;
    if (job && jobAbbrs.includes(job)) {
      router.push({ pathname: `/job/${job}`, query: { s1, s } });
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>{t('Global.title')}</title>
        <meta name="description" content={t('Global.description')} />
        { renderMeta({
          title: t('Global.title'),
          description: t('Global.description'),
          canonicalPath: '/'
        }) }
      </Head>

      <AppContextProvider>
        <GlobalHeader />
      </AppContextProvider>

      <Hero />

      <div
        className={`container ${styles.jobSelect}`}
        itemScope
        itemType="https://schema.org/ItemList"
      >
        <h2 className={styles.title} id="jobSelectTitle" itemProp="name">
          { t('JobSelect.job_select') }
        </h2>
        <JobMenu />
      </div>

      <div className="container">
        <AdUnit id="ad-IndexPage" />
      </div>

      <div className="container">
        { recentLayouts?.length > 0 && (
          <LayoutsList
            id="recentLayouts"
            className={styles.recentLayouts}
            title={t('Pages.Index.recent_layouts')}
            layouts={recentLayouts}
          />
        )}

        <div className={styles.popularLayoutsSection}>
          <h2 className={styles.title}>
            {t('Pages.Index.popular_layouts')}
          </h2>

          <div className={styles.popularLayoutsContainer}>
            { popularLayoutsByJob?.map(({ job, layouts }, position) => (
              <React.Fragment key={`layoutList-${job.Abbr}`}>
                <div className={styles.popularList}>
                  <LayoutsList
                    showAds={false}
                    id={`popularLayouts-${job.Abbr}`}
                    className={styles.popularLayouts}
                    layouts={layouts}
                    columns={1}
                    header="h3"
                    title={(
                      <Link
                        href={localizePath(`/job/${job.Abbr}`, router.locale)}
                        className={styles.popularListClassLink}
                        title={t('Pages.Layout.view_more')}
                      >
                        <Image
                          src={`/jobIcons/${job.Name.replaceAll(' ', '')}.png`}
                          alt={`${job.Name} Icon`}
                          draggable={false}
                          height={32}
                          width={32}
                          itemProp="image"
                        />
                        { translateData('Name', job, router.locale) }
                      </Link>
                    )}
                  />

                  <Link
                    href={localizePath(`/job/${job.Abbr}`, router.locale)}
                    className={styles.footerLink}
                  >
                    { t(
                      'Pages.Layout.more_layouts_by_job',
                      { jobName: translateData('Name', job, router.locale) }
                    ) }
                  </Link>
                </div>

                { position % 3 === 2 && (
                  <AdUnit
                    className={styles.flexAdUnit}
                    id={`ad-popLayouts-${position}`}
                  />
                ) }
              </React.Fragment>
            )) }
          </div>
        </div>
      </div>

      <HowTo />
      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const layoutsQuery = {
    include: {
      user: {
        select: { name: true, image: true }
      },
      _count: {
        select: { hearts: true }
      },
    },
    where: {
      title: { not: '' },
      description: { not: '' },
      published: true
    }
  };

  try {
    const recentLayouts = await db.layout.findMany({
      ...layoutsQuery,
      take: 24,
      distinct: ['userId'],
      orderBy: { updatedAt: 'desc' }
    });

    const layoutsWithHearts = await db.layout.findMany({
      ...layoutsQuery,
      where: {
        ...layoutsQuery.where,
        hearts: {
          some: {}, // Filters layouts that have at least one heart
        },
      },
      orderBy: {
        hearts: { _count: 'desc' }
      }
    });

    const craftingJobs = Jobs
      .filter((job) => ['DOH', 'DOL'].includes(job.Role))
      .map((job) => job.Abbr);

    type LayoutGroupProps = {
      [key:string]: {
        job: ClassJobProps,
        layouts: LayoutViewProps[]
      }
    }

    const jobGroupedLayouts:LayoutGroupProps = layoutsWithHearts
      .reduce((acc:LayoutGroupProps, layout:LayoutViewProps) => {
        const { jobId } = layout;

        if (jobId && !craftingJobs.includes(jobId)) {
          if (!acc[jobId]) {
            acc[jobId] = {
              job: Jobs.find((job) => job.Abbr === jobId)!,
              layouts: []
            };
          }
          acc[jobId].layouts.push(layout);
        }

        return acc;
      }, {});

    const layoutsByJob = Object.entries(jobGroupedLayouts)
      .filter(([, jobLayouts]) => jobLayouts.layouts.length >= 3 && jobLayouts)
      .map(([, jobLayouts]) => jobLayouts);

    const groupedLayoutsByJob = [
      layoutsByJob.filter((entry) => entry.job.Role === 'TANK'),
      layoutsByJob.filter((entry) => entry.job.Role === 'HEAL'),
      layoutsByJob.filter((entry) => entry.job.Role === 'MDPS'),
      layoutsByJob.filter((entry) => entry.job.Role === 'PDPS'),
      layoutsByJob.filter((entry) => entry.job.Role === 'RDPS')
    ]
      .flat()
      .map(({ job, layouts }) => ({ job, layouts: serializeDates(layouts.slice(0, 4)) }));

    return {
      props: {
        ...(await serverSideTranslations(context.locale as string, ['common'])),
        recentLayouts: serializeDates(recentLayouts),
        popularLayoutsByJob: groupedLayoutsByJob
      }
    };
  } catch (error) {
    Sentry.captureException(error);

    return {
      props: {
        ...(await serverSideTranslations(context.locale as string, ['common'])),
        recentLayouts: [],
        popularLayoutsByJob: []
      }
    };
  }
};
