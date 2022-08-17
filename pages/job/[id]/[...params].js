import PropTypes from 'prop-types';
import fetch from 'node-fetch';
import { root } from 'lib/host';
import {
  listJobs,
  listJobActions,
  listRoleActions
} from 'lib/api';
import I18n from 'lib/I18n/locale/en-US';
import shortDesc from 'lib/shortDesc';
import Head from 'next/head';
import { AppContextProvider } from 'components/App/context';
import GlobalHeader from 'components/GlobalHeader';
import Hero from 'components/Hero';
import Lore from 'components/Lore';
import HowTo from 'components/HowTo';
import Articles from 'components/Articles';
import Footer from 'components/Footer';
import App from 'components/App';
import EorzeaProfile from 'components/EorzeaProfile';
import styles from './job.module.scss';

export default function Index({
  jobs,
  selectedJob,
  actions,
  roleActions,
  viewData,
  viewAction
}) {
  const { layout, encodedSlots, title } = viewData;
  const readOnly = (viewData && viewAction !== 'edit');

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
        <title>
          {`${title} • ${selectedJob.Name} (${selectedJob.Abbr}) Hotbars • XIVBARS`}
        </title>
      </Head>

      <GlobalHeader />

      <AppContextProvider
        actions={actions}
        roleActions={roleActions}
        selectedJob={selectedJob}
        jobs={jobs}
        layout={layout}
        encodedSlots={encodedSlots}
        readOnly={readOnly}
        viewData={viewData}
        viewAction="show"
      >
        <App />

        <div className="container section">
          <div className={styles.description}>
            <h2>{selectedJob.Name} {I18n.Global.title}</h2>

            <p className={styles.jobDesc}>
              {shortDesc(selectedJob, actions)}
            </p>

            { selectedJob.Description && <Lore selectedJob={selectedJob} /> }
          </div>
        </div>
      </AppContextProvider>

      <div className="section">
        {(selectedJob) && <Hero primary={(!selectedJob)} />}
        <HowTo />
        <EorzeaProfile />
        <Articles />
      </div>

      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const { id, params } = context.params;
    const [layoutId, viewAction] = params;

    // Get Selected Job
    const decoratedJobs = await listJobs();
    const selectedJob = id
      ? decoratedJobs.find((job) => job.Abbr === id)
      : null;

    const fetchView = await fetch(`${root}/api/layout/${layoutId}`);
    const viewData = await fetchView.json();

    let jobActions = [];
    let roleActions = [];

    // Fetch Actions
    if (selectedJob) {
      jobActions = await listJobActions(selectedJob);
      // TODO: Refactor this is pull IDS from ClassJob object instead of ROLE_ACTION_IDS
      if (selectedJob.Role) {
        roleActions = await listRoleActions(selectedJob);
      }
    }

    return {
      props: {
        jobs: decoratedJobs,
        actions: jobActions,
        selectedJob,
        roleActions,
        viewData: {
          ...viewData,
          createdAt: viewData.createdAt.toString(),
          updatedAt: viewData.updatedAt?.toString() || null
        },
        viewAction: viewAction || 'show'
      }
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}

Index.propTypes = {
  selectedJob: PropTypes.shape().isRequired,
  jobs: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  roleActions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  viewData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    layout: PropTypes.number.isRequired,
    encodedSlots: PropTypes.string.isRequired
  }).isRequired,
  viewAction: PropTypes.string.isRequired
};
