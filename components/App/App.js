/* eslint-disable react/no-danger */
import fetch from 'node-fetch';
import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { group } from 'lib/utils/array';
import { useAppDispatch, useAppState } from 'components/App/context';
import ControlBar from 'components/ControlBar';
import ActionPanel from 'components/ActionPanel';
import UILayout from 'components/UILayout';
import Tooltip, { TooltipContextProvider } from 'components/Tooltip';
import { SelectedActionContextProvider } from 'components/SelectedAction';

import styles from './App.module.scss';

export function App() {
  const { data: session } = useSession();
  const appDispatch = useAppDispatch();
  const router = useRouter();
  const {
    jobs,
    selectedJob,
    actions,
    roleActions,
    layout,
    encodedSlots
  } = useAppState();
  const titleField = useRef();
  const descriptionField = useRef();

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

  function saveLayout() {
    const title = titleField.current.value;
    const description = descriptionField.current.value;

    fetch('/api/layout/create', {
      method: 'POST',
      body: JSON.stringify({
        title,
        description,
        layout,
        encodedSlots,
        jobId: selectedJob.ID
      }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then((data) => data.json())
      .then((json) => console.log(json));
  }

  return (
    <TooltipContextProvider>
      <SelectedActionContextProvider>
        { jobs && <ControlBar jobs={jobs} selectedJob={selectedJob} /> }

        { session && (
          <form className={`${styles.control} container section`}>
            <label htmlFor="title">
              <div>Title</div>
              <input type="text" id="title" name="title" ref={titleField} />
            </label>
            <label htmlFor="description">
              <div>Description</div>
              <textarea id="description" ref={descriptionField} />
            </label>
            <button type="button" onClick={saveLayout}>Save</button>
          </form>
        )}

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
