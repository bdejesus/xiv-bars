import React, { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import * as Sentry from '@sentry/nextjs';
import { useRouter } from 'next/router';
import Head from 'next/head';
import db, { serializeDates } from 'lib/db';
import { AppContextProvider } from 'components/App/context';
import GlobalHeader from 'components/GlobalHeader';
import HowTo from 'components/HowTo';
import Hero from 'components/Hero';
import JobMenu from 'components/JobSelect/JobMenu';
import Footer from 'components/Footer';
import EorzeaProfile from 'components/EorzeaProfile';
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

  console.log(popularLayoutsByJob);

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

        <div className={styles.popularLayoutsByJob}>
          <h2>{t('Pages.Index.popular_layouts')}</h2>
          <div className={styles.popularLayoutsByJobLists}>
            { popularLayoutsByJob?.map(({job, layouts}, position) => (
              <>
                <LayoutsList
                  showAds={false}
                  id={`popularLayouts-${job.Abbr}`}
                  className={styles.popularLayouts}
                  title={job.Name}
                  header={'h3'}
                  layouts={layouts}
                  columns={1}
                />
                { position % 6 === 5 && (
                  <AdUnit
                    className={styles.flexAdUnit}
                    id={`ad-popLayouts-${position}`}
                  />
                ) }
              </>
            )) }
          </div>
        </div>
      </div>

      <HowTo />
      <EorzeaProfile />
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
    const layouts = await db.layout.findMany({
      ...layoutsQuery,
      take: 24,
      distinct: ['userId'],
      orderBy: { updatedAt: 'desc' }
    });

    const listJobs = Jobs.filter((job) => !['DOH', 'DOL'].includes(job.Role))

    const layoutGroupsRequest = listJobs.map(async (job) => {
      const jobLayouts = await db.layout.findMany({
        ...layoutsQuery,
        where: {
          ...layoutsQuery.where,
          jobId: job.Abbr
        },
        take: 3,
        orderBy: {
          hearts: { _count: 'desc' }
        }
      })

      const filteredJobLayouts = jobLayouts.filter((layout:LayoutViewProps) => layout._count.hearts > 0);

      return {
        job,
        layouts: serializeDates(filteredJobLayouts)
      }
    });

    const layoutsByJob = await Promise.all(layoutGroupsRequest);
    const groupedLayoutsByJob = [
      layoutsByJob.filter((jobLayouts) => jobLayouts.job.Role === 'TANK'),
      layoutsByJob.filter((jobLayouts) => jobLayouts.job.Role === 'HEAL'),
      layoutsByJob.filter((jobLayouts) => jobLayouts.job.Role === 'MDPS'),
      layoutsByJob.filter((jobLayouts) => jobLayouts.job.Role === 'PDPS'),
      layoutsByJob.filter((jobLayouts) => jobLayouts.job.Role === 'RDPS')
    ]
      .flat()
      .filter((jobLayouts) => jobLayouts.layouts.length > 0);

    return {
      props: {
        ...(await serverSideTranslations(context.locale as string, ['common'])),
        recentLayouts: serializeDates(layouts),
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
