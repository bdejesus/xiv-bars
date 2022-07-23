/* eslint-disable react/no-danger */

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { group } from 'lib/utils/array';
import { useAppDispatch, useAppState } from 'components/App/context';
import ControlBar from 'components/ControlBar';
import JobSelect, { JobSelectContextProvider } from 'components/JobSelect';
import ActionPanel from 'components/ActionPanel';
import UILayout from 'components/UILayout';
import Tooltip, { TooltipContextProvider } from 'components/Tooltip';
import SelectedJob from 'components/JobSelect/SelectedJob';
import { SelectedActionContextProvider } from 'components/SelectedAction';

import styles from './App.module.scss';

export function App() {
  const appDispatch = useAppDispatch();
  const router = useRouter();
  const {
    jobs,
    selectedJob,
    actions,
    roleActions,
    readOnly,
    viewData
  } = useAppState();

  useEffect(() => {
    // Decode Slots query param
    function decodeSlots() {
      const { s1, s } = router.query;
      if (s1) return group(s1.split(','), 16);
      if (s) return JSON.parse(s);
      return null;
    }

    if (router) {
      const slots = decodeSlots();

      if (slots) {
        appDispatch({
          type: 'bulkLoadActionsToSlots',
          slottedActions: slots
        });
      }
    }
  }, [router]);

  return (
    <TooltipContextProvider>
      <SelectedActionContextProvider>
        { jobs && <ControlBar jobs={jobs} selectedJob={selectedJob} /> }

        { selectedJob && (
          <div className="app-view">
            <div className="container">
              <div className={styles.container}>
                <div className={`${styles.sidebar}`}>
                  { readOnly ? (
                    <div className={styles.section}>
                      <SelectedJob job={selectedJob} />
                      <h3>{viewData.title}</h3>
                      <p>{viewData.description}</p>
                    </div>
                  ) : (
                    <>
                      <JobSelectContextProvider>
                        <JobSelect jobs={jobs} selectedJob={selectedJob} />
                      </JobSelectContextProvider>
                      <ActionPanel roleActions={roleActions} actions={actions} />
                    </>
                  )}
                </div>

                <div className={styles.main}>
                  <UILayout />
                </div>
              </div>

              <Tooltip />
            </div>
          </div>
        )}
      </SelectedActionContextProvider>
    </TooltipContextProvider>
  );
}

export default App;
