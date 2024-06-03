import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppState } from 'components/App/context';
import Tooltip, { TooltipContextProvider } from 'components/Tooltip';
import DetailPanel from 'components/DetailPanel';
import ControlBar from 'components/ControlBar';
import { layouts } from 'lib/xbars';
import Xbar from 'components/UILayout/Xbar';
import Hotbar from 'components/UILayout/Hotbar';
import ActionPanel from 'components/ActionPanel';
import SystemMessage from 'components/SystemMessage';
import { SelectedActionContextProvider } from 'components/SelectedAction';
import { appActions } from 'components/App/actions';

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
    showDetails,
    viewData,
    viewAction
  } = appState;

  const router = useRouter();
  const layoutKey = viewData.layout as keyof typeof layouts;

  useEffect(() => {
    if (router.query.jobId) {
      appDispatch({
        type: appActions.LOAD_VIEW_DATA,
        payload: {
          viewData,
          selectedJob,
          actions,
          roleActions,
          viewAction,
          urlParams: router.query
        }
      });
    }
  }, [router.query]);

  if (!selectedJob) return null;

  return (
    <TooltipContextProvider>
      <SelectedActionContextProvider>
        <div className={`${styles.view} app-view`} data-action={viewAction}>
          <SystemMessage />

          <DetailPanel className={styles.detailPanel} visible={showDetails} />

          <div className={styles.mainPanel}>
            { jobs && <ControlBar /> }

            <div className={styles.container}>
              { !readOnly && roleActions && actions && (
              <div className={`${styles.actionsPanel}`}>
                <ActionPanel roleActions={roleActions} actions={actions} />
              </div>
              ) }

              <div className={styles.main} data-readonly={readOnly}>
                { layouts[layoutKey] === 'chotbar'
                  ? <Xbar />
                  : <Hotbar />}
              </div>
            </div>
          </div>
        </div>

        <Tooltip />
      </SelectedActionContextProvider>
    </TooltipContextProvider>
  );
}

App.defaultProps = {
  encodedSlots: undefined
};

export default App;
