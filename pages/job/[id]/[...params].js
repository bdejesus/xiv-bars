import PropTypes from 'prop-types';
import { domain } from 'lib/host';
import {
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
import Footer from 'components/Footer';
import App from 'components/App';
import EorzeaProfile from 'components/EorzeaProfile';
import Jobs from '.apiData/Jobs.json';

import styles from './params.module.scss';

export default function Index({
  selectedJob,
  actions,
  roleActions,
  viewData,
  viewAction
}) {
  const { layout, encodedSlots, title } = viewData;
  const readOnly = (viewData && viewAction !== 'edit');
  const pageTitle = `${title} • ${selectedJob.Name} (${selectedJob.Abbr}) Hotbars • XIVBARS`;

  const canonicalUrl = `https://xivbars.bejezus.com/job/${selectedJob.Abbr}/${viewData.id}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={viewData.description} />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      <AppContextProvider
        actions={actions}
        roleActions={roleActions}
        selectedJob={selectedJob}
        layout={layout}
        encodedSlots={encodedSlots}
        readOnly={readOnly}
        viewData={viewData}
        viewAction="show"
      >
        <GlobalHeader selectedJob={selectedJob} title={title} />

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
        <EorzeaProfile />
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
    const selectedJob = id ? Jobs.find((job) => job.Abbr === id) : null;

    const fetchOptions = {
      method: 'POST',
      body: JSON.stringify({ id: layoutId }),
      headers: { 'Content-Type': 'application/json' }
    };
    const fetchView = await fetch(`${domain}/api/layout`, fetchOptions);
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
  actions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  roleActions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  viewData: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    layout: PropTypes.number,
    encodedSlots: PropTypes.string
  }).isRequired,
  viewAction: PropTypes.string.isRequired
};
