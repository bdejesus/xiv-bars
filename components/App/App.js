import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { group } from 'lib/utils/array';
import { useAppDispatch, useAppState } from 'components/App/context';
import Modal from 'components/Modal';
import Tooltip, { TooltipContextProvider } from 'components/Tooltip';
import ControlBar from 'components/ControlBar';
import SelectedJob from 'components/JobSelect/SelectedJob';
import JobSelect from 'components/JobSelect';
import JobMenu from 'components/JobSelect/JobMenu';
import UILayout from 'components/UILayout';
import ActionPanel from 'components/ActionPanel';
import { SelectedActionContextProvider } from 'components/SelectedAction';

import styles from './App.module.scss';

export function App() {
  const [showJobMenu, setShowJobMenu] = useState(false);
  const appDispatch = useAppDispatch();
  const {
    jobs,
    selectedJob,
    actions,
    roleActions,
    readOnly,
    viewData
  } = useAppState();

  const router = useRouter();

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
                      <JobSelect
                        jobs={jobs}
                        selectedJob={selectedJob}
                        toOpen={() => setShowJobMenu(true)}
                      />
                      <ActionPanel
                        roleActions={roleActions}
                        actions={actions}
                      />
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

        <Modal
          hidden={!showJobMenu}
          toClose={() => setShowJobMenu(false)}
        >
          <JobMenu jobs={jobs} />
        </Modal>
      </SelectedActionContextProvider>
    </TooltipContextProvider>
  );
}

export default App;
