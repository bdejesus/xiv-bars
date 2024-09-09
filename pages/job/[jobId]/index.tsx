import React, { useEffect } from 'react';
import db, { serializeDates } from 'lib/db';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { translateData, localizePath } from 'lib/utils/i18n.mjs';
import * as Sentry from '@sentry/nextjs';
import { useRouter } from 'next/router';
import Link from 'next/link';
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
import dynamic from 'next/dynamic';
import { hasSprite } from 'components/JobSprite';
import renderMeta from 'components/Meta';

import type { ClassJobProps } from 'types/ClassJob';
import type { LayoutViewProps } from 'types/Layout';
import type { GetServerSideProps } from 'next';

import styles from './index.module.scss';

const AdUnit = dynamic(() => import('components/AdUnit'), { ssr: false });

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

  function toParam(string:string) {
    return string.toLowerCase().replaceAll(' ', '');
  }

  const guidePath = ['DOH', 'DOL'].includes(selectedJob.Discipline) ? 'crafting_gathering_guide' : 'jobguide';
  const guideLocales = {
    en: 'na',
    ja: 'jp',
    fr: 'fr',
    de: 'de'
  };
  const guideLocale = guideLocales[router.locale as keyof typeof guideLocales];
  const guideUrl = `https://${guideLocale}.finalfantasyxiv.com/${guidePath}/${toParam(selectedJob.Name)}/`;

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
            {`${t('Pages.Job.title', { jobName, jobAbbr })} | XIVBARS`}
          </title>Lore

          <meta name="description" content={t('Pages.Job.description', { jobName })} />
          { hasSprite(selectedJob) && (
            <meta property="og:image" content={`${domain}/classjob/sprite-${selectedJob.Abbr}@2x.png`} />
          )}

          { renderMeta({
            title: `${t('Pages.Job.title', { jobName, jobAbbr })} | XIVBARS`,
            description: t('Pages.Job.description', { jobName }),
            canonicalPath: router.asPath
          }) }
        </Head>
      )}

      <GlobalHeader selectedJob={selectedJob} />

      <div
        className="container"
        itemScope
        itemProp="itemListElement"
        itemType="https://schema.org/ItemList"
      >
        <div className={`${styles.header} row`}>
          <div className="main">
            <SelectedJob
              job={selectedJob}
              className={styles.title}
            >
              { selectedJob?.Description && <Lore description={selectedJob.Description} /> }

              <div className={styles.actions}>
                <Link
                  href={localizePath(`/job/${selectedJob.Abbr}/new`, router.locale)}
                  className={`button btn-primary btn-lg ${styles.newLink}`}
                >
                  <Icon id={Icons.ADD} alt={t('GlobalHeader.new_layout')} />
                  <span className="btn-label">{t('GlobalHeader.new_layout')}</span>
                </Link>

                <a
                  href={guideUrl}
                  target="_blank"
                  className={styles.jobGuideLink}
                >
                  <Icon id={Icons.HELP} alt={t('Icon.info')} />
                  <span className="btn-label">
                    { t('Pages.Job.job_guide', { jobName }) }
                  </span>
                </a>
              </div>
            </SelectedJob>

            <p className="text-xl" itemProp="description">
              { t('Pages.Job.description', { jobName: selectedJob.Name }) }
            </p>

          </div>

          <div className="sidebar">
            <AdUnit id="ad-JobsIndexPage" />
          </div>
        </div>

        { layouts.length > 0
          ? (
            <LayoutsList
              id="jobLayouts"
              title={t('Pages.Job.keybinding_and_layout_guides', { jobName })}
              layouts={layouts}
              className="mb-lg"
              filterable
            />
          )
          : (
            <>
              <h2>{t('Pages.Job.no_layouts', { jobName })}</h2>
              <Link
                className="button btn-inline btn-primary"
                href={`/job/${selectedJob.Abbr}/new`}
              >
                {t('Pages.Job.create_layout')}
              </Link>
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
