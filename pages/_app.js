import React, { useState } from 'react';
import App from 'next/app';
import Head from 'next/head';
import XIVAPI from 'xivapi-js';
import { ascByKey } from 'utils';
import { advancedJobs, roleActionIDs } from 'models/jobs';
import { Meta, Icons } from './app';
import XIVBars from '.';
import AppContextProvider from './app-context';

import styles from './app/styles.scss';

class AppContainer extends App {
  render() {
    const {
      jobs,
      actions,
      selectedJob,
      roleActions
    } = this.props;

    const title = 'FFXIV W Cross HotBar (WXHB) Simulator | XIV Bars';
    const description = 'XIV Bars is a simple app for previewing the Final Fantasy XIV W Cross HotBar (WXHB). Simulate what your hotbar actions could look like for playing Final Fantasy XIV with a gamepad or controller. Use the Class selector to load actions for that class. Drag and drop them to the hotbar slots below.';

    return (
      <>
        <Head>
          {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=UA-144541753-2"
          />
          {/* eslint-disable-next-line react/no-danger */}
          <script dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag() {
                dataLayer.push(arguments);
              }
              gtag("js", new Date());
              gtag("config", "UA-144541753-2");
            `
          }}
          />
          <title>
            {title}
          </title>
          <Meta
            title={title}
            description={description}
            canonical="https://xivbars.josebenedicto.com"
          />
          <Icons />
        </Head>
        <AppContextProvider>
          <main>
            <div className={`${styles.container} ${styles.primary}`}>
              <h1>XIV Bars</h1>
              <p>A Final Fantasy XIV W Cross HotBar (WXHB) Preview Tool.</p>
              <p>
                Simulate what your WXHB actions could look like when playing
                Final Fantasy XIV with a gamepad or controller. Use the Job
                selector to load actions for that class and Drag them into
                the hotbar slots below like you would in the game.
              </p>
              <XIVBars
                jobs={jobs}
                actions={actions}
                selectedJob={selectedJob}
                roleActions={roleActions}
              />
            </div>

            <div className={`${styles.container} ${styles.links}`}>
              <h3>
                <a href="https://josebenedicto.com/ffxiv/cross-hotbar-settings--auto-switching-for-battle">
                  Cross Hotbar Settings: Auto-switching for Battle
                </a>
              </h3>

              <p>
                How to set your Cross Hotbars in Controller Mode to auto-switch
                to a combat hotbar when entering battle stance.
              </p>

              <p>
                If you play in <b>Controller Mode</b>, you can set your Cross
                Hotbars to automatically switch to a different Hotbar whenever
                you go into battle stance. This frees you up from having to
                manually switch to the correct hotbar every time you&apos;re
                coming in and out of combat.
              </p>

              <p>
                <a href="https://josebenedicto.com/ffxiv/cross-hotbar-settings--auto-switching-for-battle">
                  Read more...
                </a>
              </p>
            </div>

            <div className={`${styles.container} ${styles.info}`}>
              <p>
                <a href="https://xivapi.com/">Powered by XIVAPI</a>
              </p>
              <p>
                All Final Fantasy XIV content is property of Square Enix Co.,
                LTD
              </p>
            </div>
          </main>
        </AppContextProvider>
      </>
    );
  }
}

AppContainer.getInitialProps = async ({ ctx }) => {
  // eslint-disable-next-line global-require
  const api = new XIVAPI();

  // Get Jobs List
  const jobsData = await api.data.list('ClassJob');
  const jobs = jobsData.Results.sort(ascByKey('Name'));

  function decorateJobs() {
    const decoratedData = advancedJobs.map((advancedJob) => {
      const jobData = jobs.find((job) => job.ID === advancedJob.ID);
      return { ...jobData, ...advancedJob };
    });
    return decoratedData;
  }

  const decoratedJobs = decorateJobs();

  // Get Selected Job
  const { query } = ctx;

  let queryId = 'BRD';

  const getSelectedJob = () => {
    if (query.job) {
      queryId = query.job;
    }
    return decoratedJobs.find((job) => job.Abbr === queryId);
  };

  const selectedJob = getSelectedJob();

  // Get Job Actions
  const jobActionsData = await api.search('', {
    filters: `ClassJob.ID=${selectedJob.ID}`
  });
  let jobActions = jobActionsData.Results;

  if (selectedJob.ClassID !== null) {
    const classActionsReq = await api.search('', {
      filters: `ClassJob.ID=${selectedJob.ClassID}`
    });
    jobActions = jobActions.concat(classActionsReq.Results);
  }

  jobActions = jobActions.filter((action) => action.UrlType === 'Action');
  jobActions = jobActions.sort(ascByKey('Icon'));
  jobActions = jobActions.filter(
    (action, index, self) => index === self.findIndex((t) => t.Name === action.Name)
  );

  let roleActions = [];
  if (selectedJob.Role) {
    const roleActionsData = await api.data.list('Action', { ids: roleActionIDs[selectedJob.Role].toString() });
    roleActions = roleActionsData.Results;
  }

  return {
    jobs: decoratedJobs, actions: jobActions, selectedJob, roleActions
  };
};

export default AppContainer;
