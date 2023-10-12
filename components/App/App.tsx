import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { sortIntoGroups } from 'lib/utils/array.mjs';
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
import { AppAction } from './actions';
import styles from './App.module.scss';

type QueryProps = {
  [key: string]: string
}

export function App() {
  const [showJobMenu, setShowJobMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const appDispatch = useAppDispatch();
  const {
    jobs,
    selectedJob,
    actions,
    roleActions,
    readOnly,
    viewData,
    encodedSlots
  } = useAppState();

  const router = useRouter();

  useEffect(() => {
    // rest system messages whenever user navigates
    function resetMessage() {
      appDispatch({ type: AppAction.UPDATE_MESSAGE, payload: { message: undefined } });
    }

    if (encodedSlots) {
      appDispatch({ type: AppAction.SLOT_ACTIONS, payload: { encodedSlots } });
    } else {
      router.events.on('routeChangeStart', resetMessage);
    }

    return () => {
      router.events.off('routeChangeStart', resetMessage);
    };
  }, []);

  useEffect(() => {
    // convert Slots from query param to JSON
    function decodeSlots() {
      const {
        s1, s, wxhb, xhb, exhb, hb
      } = router.query as QueryProps;

      let slots;
      if (s1) slots = sortIntoGroups(s1.split(','), 16);
      if (s) slots = JSON.parse(s);

      const formatHbConfig: number[] = hb?.split(',').map((i) => parseInt(i, 10));

      appDispatch({
        type: AppAction.SLOT_ACTIONS,
        payload: {
          slottedActions: slots,
          wxhb: parseInt(wxhb, 10),
          xhb: parseInt(xhb, 10),
          exhb: parseInt(exhb, 10),
          hb: formatHbConfig,
          encodedSlots: router.query.s1?.toString() || router.query.s?.toString()
        }
      });
    }

    if (router) decodeSlots();
  }, [router]);

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
                  { viewData && readOnly ? (
                    <div className={styles.section}>
                      <SelectedJob job={selectedJob} />

                      <h3>{viewData.title}</h3>

                      <div className={styles.owner}>
                        {viewData.user.name}
                      </div>

                      { viewData.description && (
                        <ReactMarkdown components={{
                          h1: 'h4', h2: 'h5', h3: 'h6', h4: 'p', h5: 'p', h6: 'p'
                        }}
                        >
                          {viewData.description}
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
