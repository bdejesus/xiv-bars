import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { decodeSlots } from 'lib/utils/slots';
import { useAppDispatch, useAppState } from 'components/App/context';
import Tooltip, { TooltipContextProvider } from 'components/Tooltip';
import DetailPanel from 'components/DetailPanel';
import ControlBar from 'components/ControlBar';
import UILayout from 'components/UILayout';
import ActionPanel from 'components/ActionPanel';
import SystemMessage from 'components/SystemMessage';
import { SelectedActionContextProvider } from 'components/SelectedAction';
import { AppActions } from 'components/App/actions';

import styles from './App.module.scss';

export function App() {
  const appDispatch = useAppDispatch();
  const appState = useAppState();
  const {
    jobs,
    selectedJob,
    actions,
    roleActions,
    readOnly,
    encodedSlots
  } = appState;
  const router = useRouter();

  useEffect(() => {
    appDispatch({ type: AppActions.INITIALIZE });
  }, []);

  useEffect(() => {
    // Push UI changes to state whenever routes params changes
    // convert Slots from query param to JSON
    const payload = decodeSlots({
      ...router.query,
      encodedSlots: readOnly ? encodedSlots : undefined,
      appState
    });

    appDispatch({ type: AppActions.SLOT_ACTIONS, payload });
  }, [router.query]);

  return (
    <TooltipContextProvider>
      <SelectedActionContextProvider>
        <div className={`${styles.view} app-view`}>
          <div className={styles.detailPanel}>
            <DetailPanel />
          </div>

          <div className={styles.mainPanel}>
            { jobs && selectedJob && <ControlBar /> }

            <SystemMessage />

            { selectedJob && (
              <>
                <div className={styles.container}>
                  { !readOnly && roleActions && actions && (
                    <div className={`${styles.sidebar}`}>
                      <ActionPanel roleActions={roleActions} actions={actions} />
                    </div>
                  ) }

                  <div className={styles.main}>
                    <UILayout />
                  </div>
                </div>

                <Tooltip />
              </>
            )}
          </div>
        </div>
      </SelectedActionContextProvider>
    </TooltipContextProvider>
  );
}

App.defaultProps = {
  encodedSlots: undefined
};

export default App;
