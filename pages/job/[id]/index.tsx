import React, { useEffect } from 'react';
import db from 'lib/db';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { AppContextProvider } from 'components/App/context';
import GlobalHeader from 'components/GlobalHeader';
import LayoutCard from 'components/LayoutCard';
import Jobs from 'apiData/Jobs.json';
import SelectedJob from 'components/JobSelect/SelectedJob';

import type { ClassJobProps } from 'types/ClassJob';
import type { LayoutProps } from 'types/Layout';
import type { GetServerSideProps } from 'next';

import styles from './index.module.scss';

interface Props {
  selectedJob: ClassJobProps,
  layouts: string
}

export default function Layouts({ selectedJob, layouts }: Props) {
  const layoutsData: LayoutProps[] = JSON.parse(layouts);
  const router = useRouter();

  useEffect(() => {
    const items = ['l', 's1', 's', 'xhb', 'wxhb', 'exhb'];
    const keys = Object.keys(router.query);
    if (keys.some((i) => items.includes(i))) {
      router.push({
        pathname: `/job/${selectedJob.Abbr}/new`,
        query: router.query
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>{`FFXIV ${selectedJob.Name} (${selectedJob.Abbr}) Layouts • XIVBARS`}</title>
        <meta name="description" content={`List of hotbar layouts others have created for the ${selectedJob.Name} Class.`} />
      </Head>

      <AppContextProvider selectedJob={selectedJob}>
        <GlobalHeader />
      </AppContextProvider>

      <div className="container section">
        <h1 className={`mt-md ${styles.title}`}>
          <SelectedJob job={selectedJob} className={styles.job} />
          <Link href={`/job/${selectedJob.Abbr}/new`} className={styles.newLink}>
            <span className="newIcon">+</span>
            New {selectedJob.Name} Layout
          </Link>
        </h1>

        { layoutsData.length > 0
          ? (
            <div>
              <ul className={styles.layoutsList}>
                {layoutsData.map((layout) => {
                  const job = Jobs.find((j) => j.Abbr === layout.jobId);
                  if (!job) return null;
                  return (
                    <li key={layout.id}>
                      <LayoutCard
                        layout={layout}
                        job={job}
                        className={styles.card}
                        hideName={false}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <h2>
              No {selectedJob.Name} Layouts yet. <Link href={`/job/${selectedJob.Abbr}/new`}>Create one?</Link>
            </h2>
          )}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id: string | string[] | undefined = context.params?.id;
  const selectedJob = id
    ? Jobs.find((job) => job.Abbr === id)
    : null;

  const layouts = await db.layout.findMany({
    where: {
      jobId: selectedJob?.Abbr,
      description: { not: '' }
    },
    include: {
      user: {
        select: { name: true }
      }
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  return {
    props: {
      selectedJob,
      layouts: JSON.stringify(layouts)
    }
  };
};
