import PropTypes from 'prop-types';
import db from 'lib/db';
import {
  listJobs,
  listJobActions,
  listRoleActions
} from 'lib/api';
import I18n from 'lib/I18n/locale/en-US';
import { AppContextProvider } from 'components/App/context';
import GlobalHeader from 'components/GlobalHeader';
import Hero from 'components/Hero';
import Lore from 'components/Lore';
import HowTo from 'components/HowTo';
import Articles from 'components/Articles';
import Footer from 'components/Footer';
import UILayout from 'components/UILayout';
import LoadScreen from 'components/LoadScreen';
import EorzeaProfile from 'components/EorzeaProfile';
import shortDesc from 'lib/shortDesc';
import SelectedJob from 'components/JobSelect/SelectedJob';
import Sharing from 'components/Sharing';
import ExportToMacros from 'components/ExportToMacro';
import { SelectedActionContextProvider } from 'components/SelectedAction';
import Tooltip, { TooltipContextProvider } from 'components/Tooltip';
import ControlBar from 'components/ControlBar';

// import styles from '../../Index.module.scss';
import styles from './job.module.scss';

export default function Index({
  jobs,
  selectedJob,
  actions,
  roleActions,
  layoutData
}) {
  const { layout, encodedSlots } = layoutData;
  return (
    <>
      <GlobalHeader />

      <AppContextProvider
        actions={actions}
        roleActions={roleActions}
        selectedJob={selectedJob}
        jobs={jobs}
        layout={layout}
        encodedSlots={encodedSlots}
        readOnly
      >
        <TooltipContextProvider>
          <SelectedActionContextProvider>
            <ControlBar jobs={jobs} selectedJob={selectedJob} />

            <div className="app-view">
              <div className="container">
                <div className={styles.container}>
                  <div className={`panel ${styles.sidebar}`}>
                    <div className={styles.section}>
                      <SelectedJob job={selectedJob} />
                      <h3>{layoutData.title}</h3>
                      <p>{layoutData.description}</p>
                    </div>
                  </div>

                  <div className={styles.main}>
                    <UILayout />
                  </div>
                </div>

                <Tooltip />
              </div>
            </div>
          </SelectedActionContextProvider>
        </TooltipContextProvider>

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

      <div className={styles.articles}>
        {(selectedJob) && <Hero primary={(!selectedJob)} />}
        <HowTo />
        <EorzeaProfile />
        <Articles />
      </div>

      <Footer />
      <LoadScreen />
    </>
  );
}

export async function getServerSideProps(context) {
  const { id, layoutId } = context.params;

  const layoutData = await db.layout.findUnique({
    where: { id: Number.parseInt(layoutId, 6) }
  });

  if (!layoutData) return { notFound: true };

  const { layout, encodedSlots } = layoutData;

  // Get Selected Job
  const decoratedJobs = await listJobs();
  const selectedJob = id
    ? decoratedJobs.find((job) => job.Abbr === id)
    : null;

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
      layoutData,
      layout,
      encodedSlots
    }
  };
}

Index.propTypes = {
  selectedJob: PropTypes.shape().isRequired,
  jobs: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  roleActions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  layoutData: PropTypes.shape({
    layout: PropTypes.number.isRequired,
    encodedSlots: PropTypes.string.isRequired
  }).isRequired
};
