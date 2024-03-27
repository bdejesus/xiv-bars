import React, { useEffect } from 'react';
import db from 'lib/db';
import { useRouter } from 'next/router';
import Head from 'next/head';
import GlobalHeader from 'components/GlobalHeader';
import Jobs from 'apiData/Jobs.json';
import SelectedJob from 'components/JobSelect/SelectedJob';
import LayoutsList from 'components/LayoutsList';
import Lore from 'components/Lore';
import Footer from 'components/Footer';
import type { ClassJobProps } from 'types/ClassJob';
import type { LayoutViewProps } from 'types/Layout';
import type { GetServerSideProps } from 'next';

import styles from './index.module.scss';

interface Props {
  selectedJob: ClassJobProps,
  layouts: LayoutViewProps[]
}

export default function Layouts({ selectedJob, layouts }: Props) {
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
      { selectedJob?.Name && selectedJob?.Abbr && (
        <Head>
          <title>{`FFXIV ${selectedJob.Name} (${selectedJob.Abbr}) Cross Hotbar Layouts • XIVBARS`}</title>
          <meta name="description" content={`List of hotbar layouts players have created for the ${selectedJob.Name} Class.`} />
        </Head>
      )}

      <GlobalHeader selectedJob={selectedJob} />

      <div className="container section">
        <SelectedJob
          job={selectedJob}
          className={`mt-md ${styles.title}`}
        />

        { selectedJob?.Description && (
          <Lore description={selectedJob.Description} />
        ) }

        { layouts.length > 0
          ? (
            <div>
              <LayoutsList layouts={layouts} />
            </div>
          ) : (
            <h2>
              No {selectedJob.Name} Layouts yet. <a href={`/job/${selectedJob.Abbr}/new`}>Create one?</a>
            </h2>
          )}
      </div>

      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const jobId: string | string[] | undefined = context.params?.jobId;
  const selectedJob = jobId
    ? Jobs.find((job) => job.Abbr === jobId)
    : null;

  const layouts = await db.layout.findMany({
    where: {
      jobId: selectedJob?.Abbr,
      description: { not: '' }
    },
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

  const serializableLayouts = layouts.map((layout:LayoutViewProps) => ({
    ...layout,
    createdAt: layout?.createdAt?.toString(),
    updatedAt: layout?.updatedAt?.toString()
  }));

  return {
    props: {
      selectedJob,
      layouts: serializableLayouts
    }
  };
};
