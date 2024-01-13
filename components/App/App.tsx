import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { decodeSlots } from 'lib/utils/slots';
import { useAppDispatch, useAppState } from 'components/App/context';
import Modal from 'components/Modal';
import Tooltip, { TooltipContextProvider } from 'components/Tooltip';
import ControlBar from 'components/ControlBar';
import SelectedJob from 'components/JobSelect/SelectedJob';
import JobSelect from 'components/JobSelect';
import JobMenu from 'components/JobSelect/JobMenu';
import UILayout from 'components/UILayout';
import ActionPanel from 'components/ActionPanel';
import SystemMessage from 'components/SystemMessage';
import ReactMarkdown from 'react-markdown';
import { SelectedActionContextProvider } from 'components/SelectedAction';
import { AppAction } from 'components/App/actions';

import styles from './App.module.scss';

export function App() {
  const [showJobMenu, setShowJobMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const appDispatch = useAppDispatch();
  const appState = useAppState();
  const {
    jobs,
    selectedJob,
    actions,
    roleActions,
    readOnly,
    title,
    description,
    user,
    encodedSlots,
    layout,
    chotbar,
    hotbar
  } = appState;

  const router = useRouter();

  useEffect(() => {
    appDispatch({ type: AppAction.INITIALIZE });
  }, []);

  useEffect(() => {
    // Push UI changes to state whenever routes params changes
    // convert Slots from query param to JSON
    const payload = decodeSlots({
      encodedSlots: readOnly ? encodedSlots : undefined,
      ...router.query
    });
    appDispatch({ type: AppAction.SLOT_ACTIONS, payload });

    return () => {
      appDispatch({ type: AppAction.INITIALIZE });
    };
  }, [router.query]);

  useEffect(() => {
    const { params } = router.query;

    if (params) {
      const [layoutId] = params;
      setIsEditing(!readOnly && !!layoutId);
    }
  }, [readOnly]);

  return (
    <TooltipContextProvider>
      <SelectedActionContextProvider>

        { jobs && selectedJob && <ControlBar selectedJob={selectedJob} /> }

        <SystemMessage />

        { selectedJob && (
          <div className="app-view">

            <div className="container">
              <div className={styles.container}>
                <div className={`${styles.sidebar}`}>
                  { readOnly && title && user ? (
                    <div className={styles.section}>
                      <SelectedJob job={selectedJob} />

                      <h3>{title}</h3>

                      <div className={styles.owner}>
                        {user.name}
                      </div>

                      { description && (
                        <ReactMarkdown components={{
                          h1: 'h4', h2: 'h5', h3: 'h6', h4: 'p', h5: 'p', h6: 'p'
                        }}
                        >
                          {description}
                        </ReactMarkdown>
                      )}
                    </div>
                  ) : (
                    <>
                      <JobSelect
                        selectedJob={selectedJob}
                        toOpen={() => setShowJobMenu(true)}
                        disabled={readOnly || isEditing}
                      />
                      { roleActions && actions && <ActionPanel roleActions={roleActions} actions={actions} /> }
                    </>
                  )}
                </div>

                <div className={styles.main}>
                  <UILayout layout={layout || 0} chotbar={chotbar} hotbar={hotbar} />
                </div>
              </div>

              <Tooltip />
            </div>
          </div>
        )}

        { jobs && (
          <Modal
            hidden={!showJobMenu}
            toClose={() => setShowJobMenu(false)}
          >
            <JobMenu jobs={jobs} />
          </Modal>
        )}
      </SelectedActionContextProvider>
    </TooltipContextProvider>
  );
}

App.defaultProps = {
  encodedSlots: undefined
};

export default App;
