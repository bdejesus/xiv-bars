/* eslint-disable react/no-danger */
import { useAppDispatch, useAppState } from 'components/App/context';
import { group } from 'lib/utils/array';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import ControlBar from 'components/ControlBar';
import ActionPanel from 'components/ActionPanel';
import UILayout from 'components/UILayout';
import Tooltip, { TooltipContextProvider } from 'components/Tooltip';
import { SelectedActionContextProvider } from 'components/SelectedAction';
import styles from './App.module.scss';

function App() {
  const appDispatch = useAppDispatch();
  const router = useRouter();
  const {
    jobs,
    selectedJob,
    actions,
    roleActions
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
                <div className={`panel ${styles.sidebar}`}>
                  <ActionPanel roleActions={roleActions} actions={actions} />
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
