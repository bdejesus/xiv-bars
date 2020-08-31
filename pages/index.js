/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import Header from 'components/Header';
import Articles from 'components/Articles';
import Footer from 'components/Footer';
import App from 'components/App';

import {
  listJobs, listJobActions, listRoleActions, getCurrentPatch
} from 'lib/api';
import LoadScreen from 'components/LoadScreen';

import styles from './Index.styles.module.scss';

function Index(pageProps) {
  const { selectedJob, currentPatch } = pageProps;
  return (
    <>
      <App {...pageProps} />
      <div className={styles.articles}>
        {(selectedJob) && <Header primary={(!selectedJob)} />}
        <div className="container section">
          <h3 className={styles.subTitle}>
            How To Use This Planner
          </h3>

          <p>
            Creating the perfect hotbar interface setup in Final Fantasy XIV using a controller is clunky and time-consuming. This simulator allows you to plan out your hotbar layouts using a web-based drag-and-drop interface to simulate different configurations before commiting it to your controller HUD in-game.
          </p>

          <ol>
            <li>
              <h5>Select a FFXIV Class/Job</h5>
              <p>Choose from and plan your hotbars for any of the FFXIV Class/Jobs</p>
            </li>
            <li>
              <h5>Toggle between FFXIV Hotbar layouts</h5>
              <p>Simulate either a W Cross Hotbar (WXHB) or standard Hotbars layout.</p>
            </li>

            <li>
              <h5>Drag &amp; Drop Actions to Slots</h5>
              <p>Slot any of the Combat and Role actions for your selected Class/Job, as well as any Menu Command, Macros, and other Actions.</p>
            </li>
            <li>
              <h5>Share With Others</h5>
              <p>
                Once you’re done configuring your Final Fantasy XIV hotbar layout, save or share your layout with the generated URL. Use this tool as a reference to configure your hotbars in-game.
              </p>
            </li>
          </ol>

        </div>
        <Articles />
      </div>
      <Footer currentPatch={currentPatch} />
      <LoadScreen />
    </>
  );
}

Index.getInitialProps = async ({ req, query }) => {
  const host = (typeof req !== 'undefined')
    ? req.headers.host
    : undefined;

  const encodedSlots = (typeof query.s !== 'undefined')
    ? JSON.parse(query.s)
    : null;

  // Get Selected Job
  const decoratedJobs = await listJobs();
  const selectedJob = query.job ? decoratedJobs.find((job) => job.Abbr === query.job) : null;

  let jobActions = [];
  let roleActions = [];

  // Fetch Actions
  if (selectedJob) {
    jobActions = await listJobActions(selectedJob);
    // Refactor this is pull IDS from ClassJob object instead of ROLE_ACTION_IDS
    if (selectedJob.Role) {
      roleActions = await listRoleActions(selectedJob);
    }
  }

  // Fetch Version
  const currentPatch = await getCurrentPatch();

  return {
    jobs: decoratedJobs,
    actions: jobActions,
    selectedJob,
    roleActions,
    encodedSlots,
    host,
    currentPatch
  };
};

Index.propTypes = {
  selectedJob: PropTypes.shape(),
  currentPatch: PropTypes.shape().isRequired
};

Index.defaultProps = {
  selectedJob: undefined
};

export default Index;
