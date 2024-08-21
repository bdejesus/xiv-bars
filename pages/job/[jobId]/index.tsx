import React, { useEffect } from 'react';
import db, { serializeDates } from 'lib/db';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { translateData, localizePath } from 'lib/utils/i18n.mjs';
import * as Sentry from '@sentry/nextjs';
import { useRouter } from 'next/router';
import { useAppDispatch } from 'components/App/context';
import { useSystemDispatch, systemActions } from 'components/System';
import { appActions } from 'components/App/actions';
import Head from 'next/head';
import { domain } from 'lib/host';
import GlobalHeader from 'components/GlobalHeader';
import Jobs from 'apiData/Jobs.json';
import SelectedJob from 'components/JobSelect/SelectedJob';
import LayoutsList from 'components/LayoutsList';
import Lore from 'components/Lore';
import Footer from 'components/Footer';
import Icon, { Icons } from 'components/Icon';
import { hasSprite } from 'components/JobSprite';

import type { ClassJobProps } from 'types/ClassJob';
import type { LayoutViewProps } from 'types/Layout';
import type { GetServerSideProps } from 'next';

import styles from './index.module.scss';

interface Props {
  selectedJob: ClassJobProps,
  layouts: LayoutViewProps[]
}

export default function Layouts({ selectedJob, layouts }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const systemDispatch = useSystemDispatch();
  const appDispatch = useAppDispatch();
  const jobName = translateData('Name', selectedJob, router.locale);
  const jobAbbr = translateData('Abbreviation', selectedJob, router.locale);

  useEffect(() => {
    appDispatch({ type: appActions.VIEW_LIST });
    const items = ['l', 's1', 's', 'xhb', 'wxhb', 'exhb'];
    const keys = Object.keys(router.query);

    if (keys.some((i) => items.includes(i))) {
      router.push({
        pathname: `/job/${selectedJob.Abbr}/new`,
        query: router.query
      });
    }

    systemDispatch({ type: systemActions.LOADING_END });
  }, []);

  return (
    <>
      { selectedJob?.Name && selectedJob?.Abbr && (
        <Head>
          <title>
            {`${t('Pages.Job.index_title', { jobName, jobAbbr })} | XIVBARS`}
          </title>Lore
          <meta
            name="description"
            content={t('Pages.Job.index_description', { jobName })}
          />
          { hasSprite(selectedJob) && (
            <meta property="og:image" content={`${domain}/classjob/sprite-${selectedJob.Abbr}@2x.png`} />
          )}
        </Head>
      )}

      <GlobalHeader selectedJob={selectedJob} />

      <div
        className="container"
        itemScope
        itemProp="itemListElement"
        itemType="https://schema.org/ItemList"
      >
        <div className={styles.header}>
          <div className={styles.headerDesc}>
            <SelectedJob
              job={selectedJob}
              className={styles.title}
            />

            <p className="text-xl" itemProp="description">
              { t('Pages.Job.index_description', { jobName: selectedJob.Name }) }
            </p>

            <a
              href={localizePath(`/job/${selectedJob.Abbr}/new`, router.locale)}
              className={`button btn-primary btn-lg ${styles.newLink}`}
            >
              <Icon id={Icons.ADD} alt={t('GlobalHeader.new_layout')} />
              <span className="btn-label">{t('GlobalHeader.new_layout')}</span>
            </a>
          </div>

          { selectedJob?.Description && (
            <Lore description={selectedJob.Description} />
          ) }
        </div>

        { layouts.length > 0
          ? (
            <LayoutsList
              id="jobLayouts"
              layouts={layouts}
              filterable
            />
          )
          : (
            <>
              <h2>{t('Pages.Job.no_layouts', { jobName })}</h2>
              <a
                className="button btn-inline btn-primary"
                href={`/job/${selectedJob.Abbr}/new`}
              >
                {t('Pages.Job.create_layout')}
              </a>
            </>
          )}
      </div>

      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const jobId = context.params?.jobId as string;
  const selectedJob = Jobs.find((job:ClassJobProps) => job.Abbr === jobId);

  if (!selectedJob) return { notFound: true };

  // Request Layouts
  try {
    const layouts = await db.layout.findMany({
      where: {
        jobId: selectedJob?.Abbr,
        description: { not: '' },
        published: true
      },
      include: {
        user: {
          select: { name: true, id: true, image: true }
        },
        _count: {
          select: { hearts: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return {
      props: {
        ...(await serverSideTranslations(context.locale as string, ['common'])),
        selectedJob,
        layouts: serializeDates(layouts)
      }
    };
  } catch (error) {
    Sentry.captureException(error);

    return {
      props: {
        ...(await serverSideTranslations(context.locale as string, ['common'])),
        selectedJob,
        layouts: []
      }
    };
  }
};
