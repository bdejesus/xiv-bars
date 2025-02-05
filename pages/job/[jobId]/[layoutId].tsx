import React, { useEffect } from 'react';
import db from 'lib/db';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { useTranslation } from 'next-i18next';
import { GetServerSideProps } from 'next';
import { translateData } from 'lib/utils/i18n.mjs';
import { serializeDates, shuffleArray } from 'lib/utils/array.mjs';
import { useRouter } from 'next/router';
import { domain } from 'lib/host';
import { hasSprite } from 'components/JobSprite';
import Head from 'next/head';
import App, { useAppDispatch, appActions } from 'components/App';
import GlobalHeader from 'components/GlobalHeader';
import Footer from 'components/Footer';
import Jobs from 'apiData/Jobs.json';
import LayoutsList from 'components/LayoutsList';
import renderMeta from 'components/Meta';

import type { ClassJobProps } from 'types/ClassJob';
import type { PageProps } from 'types/Page';

import styles from './layoutId.module.scss';

export default function Index(props:PageProps) {
  const {
    viewData,
    selectedJob,
    actions,
    roleActions,
    viewAction,
    ownerLayouts,
    classJobLayouts
  } = props;

  const { t } = useTranslation();
  const router = useRouter();
  const displayJobName = translateData('Name', selectedJob, router.locale);
  const displayJobAbbr = translateData('Abbreviation', selectedJob, router.locale);
  const displayAuthor = t(
    'Pages.Layout.title_by_author',
    { titleName: viewData.title, authorName: viewData.user!.name }
  );

  const displayTitle = viewData.layout === 1
    ? t('Pages.Layout.title_hb', { jobName: displayJobName, jobAbbr: displayJobAbbr })
    : t('Pages.Layout.title_xhb', { jobName: displayJobName, jobAbbr: displayJobAbbr });
  const pageTitle = [displayAuthor, displayTitle, 'XIVBARS'].join(' | ');
  const appDispatch = useAppDispatch();

  useEffect(() => {
    appDispatch({
      type: appActions.LOAD_VIEW_DATA,
      payload: {
        actions,
        roleActions,
        selectedJob,
        showDetails: true,
        urlParams: router.query,
        viewAction,
        viewData
      }
    });
  }, [router.query]);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={viewData?.description} />

        { (!viewData.published
          || !viewData.description
          || viewData.description.length < 255)
          && <meta name="robots" content="noindex" />}

        { hasSprite(selectedJob) && (
          <meta property="og:image" content={`${domain}/classjob/sprite-${selectedJob.Abbr}@2x.png`} />
        )}

        { renderMeta({
          title: pageTitle,
          description: viewData?.description || '',
          canonicalPath: router.asPath
        }) }
      </Head>

      <GlobalHeader selectedJob={selectedJob} />

      <App />

      <div className={`${styles.lists} container`}>
        { classJobLayouts.length > 0 && (
          <section>
            <LayoutsList
              id="jobLayouts"
              title={t('Pages.Layout.more_layouts_by_job', { jobName: displayJobName })}
              link={{ text: t('Pages.Layout.view_more'), href: `/job/${viewData.jobId}` }}
              layouts={classJobLayouts}
              columns={3}
            />
          </section>
        ) }

        { ownerLayouts.length > 0 && (
          <section>
            <LayoutsList
              id="userLayouts"
              title={t('Pages.Layout.more_layouts_by_user', { userName: viewData.user!.name })}
              link={{ text: t('Pages.Layout.view_more'), href: `/user/${viewData!.user!.id}` }}
              layouts={ownerLayouts}
              columns={3}
            />
          </section>
        ) }
      </div>

      <Footer />
    </>
  );
}

export const getServerSideProps:GetServerSideProps = async (context) => {
  const { req, res } = context;
  const session = await getServerSession(req, res, authOptions);
  const viewerId = session?.user.id;
  const { jobId, layoutId } = context.params as {[key:string]: string};

  if (layoutId) {
    try {
      // Get Selected Job
      const selectedJob = Jobs.find((job:ClassJobProps) => job.Abbr === jobId);
      if (!selectedJob) return { notFound: true };

      // Fetch Layout Data using fetchOptions
      const fetchOptions = {
        method: 'POST',
        body: JSON.stringify({ layoutId, viewerId, method: 'read' }),
        headers: { 'Content-Type': 'application/json' }
      };
      const fetchView = await fetch(`${domain}/api/layout`, fetchOptions);
      const viewData = await fetchView.json();

      // Fetch Job Actions
      const actionsRequest = await fetch(`${domain}/api/actions?job=${jobId}&isPvp=${viewData.isPvp}`);
      const { actions, roleActions } = await actionsRequest.json();

      // DB List Query Options
      const layoutLimit = 12;
      const listOptions = {
        take: layoutLimit,
        where: {
          id: { not: viewData.id },
          description: { not: '' },
          published: true
        },
        include: {
          user: { select: { name: true, image: true } },
          _count: { select: { hearts: true } }
        },
        orderBy: { updatedAt: 'desc' }
      };

      // DB Query to fetch other layouts by the layout owner
      const ownerLayouts = await db.layout.findMany({
        ...listOptions,
        where: { ...listOptions.where, userId: viewData.user.id }
      });

      // DB Query to fetch other layouts with the same jobClass
      const classJobLayouts = await db.layout.findMany({
        ...listOptions,
        where: { ...listOptions.where, jobId: viewData.jobId },
        take: 24
      });
      // Take results, shuffle and take a subset,
      // then convert date objects to json string
      const serializableClassJobLayouts = serializeDates(shuffleArray(classJobLayouts).slice(0, layoutLimit));

      const props = {
        ...(await serverSideTranslations(context.locale as string, ['common'])),
        viewData: { ...viewData, hb: viewData.hb?.split(',') || null },
        selectedJob,
        actions,
        roleActions,
        viewAction: 'show',
        ownerLayouts: serializeDates(ownerLayouts),
        classJobLayouts: serializableClassJobLayouts
      };

      return { props };
    } catch (error) {
      console.error(error);
      return { notFound: true };
    }
  }
  return { notFound: true };
};
