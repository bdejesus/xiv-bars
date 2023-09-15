import PropTypes from 'prop-types';
import db from 'lib/db';
import Head from 'next/head';
import GlobalHeader from 'components/GlobalHeader';
import JobMenu from 'components/JobSelect/JobMenu';
import LayoutCard from 'components/LayoutCard';
import Jobs from '.apiData/Jobs.json';

import styles from './layouts.module.scss';

export default function Layouts({ selectedJob, layouts }) {
  const layoutsData = JSON.parse(layouts);

  return (
    <>
      <Head>
        <title>{`FFXIV ${selectedJob.Name} (${selectedJob.Abbr}) • XIVBARS`}</title>
      </Head>

      <GlobalHeader />

      <div className="container section">
        <h1 className="mt-md">
          {selectedJob.Name} Layouts

          <a href="/" className={styles.newLink}>
            New {selectedJob.Name} Layout
          </a>
        </h1>
      </div>

      { layoutsData.length > 0
        ? (
          <div className="container section">
            <ul className={styles.layoutsList}>
              {layoutsData.map((layout) => {
                const job = Jobs.find((j) => j.Abbr === layout.jobId);
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
          <div className="app-view">
            <div className="container">
              <JobMenu jobs={Jobs} />
            </div>
          </div>
        )}
    </>
  );
}

Layouts.propTypes = {
  selectedJob: PropTypes.shape().isRequired,
  layouts: PropTypes.string
};

Layouts.defaultProps = {
  layouts: undefined
};

export async function getServerSideProps(context) {
  const { id } = context.params;
  const selectedJob = id
    ? Jobs.find((job) => job.Abbr === id)
    : null;

  const layouts = await db.layout.findMany({
    where: { jobId: selectedJob.Abbr },
    include: {
      user: {
        select: { name: true }
      }
    }
  });

  return {
    props: {
      selectedJob,
      layouts: JSON.stringify(layouts)
    }
  };
}
