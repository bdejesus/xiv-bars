import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { decodeSlots } from 'lib/utils/slots';
import { useAppDispatch, useAppState } from 'components/App/context';
import Tooltip, { TooltipContextProvider } from 'components/Tooltip';
import ControlBar from 'components/ControlBar';
import ExportToMacros from 'components/ExportToMacro';
import Sharing from 'components/Sharing';
import UILayout from 'components/UILayout';
import ActionPanel from 'components/ActionPanel';
import SystemMessage from 'components/SystemMessage';
import ReactMarkdown from 'react-markdown';
import SaveForm from 'components/SaveForm';
import EditLayoutButton from 'components/EditLayoutButton';
import { SelectedActionContextProvider } from 'components/SelectedAction';
import { AppAction } from 'components/App/actions';

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
    title,
    description,
    user,
    encodedSlots
  } = appState;
  const router = useRouter();

  useEffect(() => {
    appDispatch({ type: AppAction.INITIALIZE });
  }, []);

  useEffect(() => {
    // Push UI changes to state whenever routes params changes
    // convert Slots from query param to JSON
    const payload = decodeSlots({
      ...router.query,
      encodedSlots: readOnly ? encodedSlots : undefined,
      appState
    });

    appDispatch({ type: AppAction.SLOT_ACTIONS, payload });
  }, [router.query]);

  return (
    <TooltipContextProvider>
      <SelectedActionContextProvider>
        <div className={`${styles.view} app-view`}>
          <div className={styles.detailPanel}>
            <div className={styles.actions}>
              <Sharing />
              <ExportToMacros />
              <EditLayoutButton />
            </div>

            { (readOnly && title && user)
              ? (
                <>
                  <div className={styles.detailPanelHead}>
                    <h3 className="mt-0 mb-0">{title}</h3>
                    <div className={styles.owner}>by {user.name}</div>
                  </div>

                  <div className={styles.detailPanelBody}>
                    { description && (
                      <ReactMarkdown components={{
                        h1: 'h4', h2: 'h5', h3: 'h6', h4: 'p', h5: 'p', h6: 'p'
                      }}
                      >
                        {description}
                      </ReactMarkdown>
                    )}
                  </div>
                </>
              )
              : <div className={styles.detailPanelBody}><SaveForm /></div> }

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
