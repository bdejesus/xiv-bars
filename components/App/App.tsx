import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppState } from 'components/App/context';
import { useSession } from 'next-auth/react';
import Tooltip, { TooltipContextProvider } from 'components/Tooltip';
import DetailPanel from 'components/DetailPanel';
import ControlBar from 'components/ControlBar';
import { layouts } from 'lib/xbars';
import Xbar from 'components/Layout/Xbar';
import Hotbar from 'components/Layout/Hotbar';
import ActionPanel from 'components/ActionPanel';
import SystemMessage from 'components/SystemMessage';
import { SelectedActionContextProvider } from 'components/SelectedAction';
import { appActions } from 'components/App/actions';
import Modal from 'components/Modal';
import MarkdownGuide from 'components/SaveForm/MarkdownGuide';
import dynamic from 'next/dynamic';

import styles from './App.module.scss';

const AdUnit = dynamic(() => import('components/AdUnit'), { ssr: false });

export function App() {
  const appDispatch = useAppDispatch();
  const appState = useAppState();
  const { data: session } = useSession();
  const {
    jobs,
    selectedJob,
    actions,
    roleActions,
    readOnly,
    showDetails,
    viewData,
    viewAction,
    showMarkdownGuide
  } = appState;
  const [showControlPanels, setShowControlPanels] = useState(false);

  const router = useRouter();
  const layoutKey = viewData.layout as keyof typeof layouts;

  useEffect(() => {
    const shouldShow = !readOnly && !!roleActions && !!actions;
    setShowControlPanels(shouldShow);
  }, [readOnly, roleActions, actions]);

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
  }, [router.query, viewAction, viewData.encodedSlots]);

  function closeMarkdownGuide() {
    appDispatch({
      type: appActions.SET_STATE,
      payload: {
        showMarkdownGuide: false
      }
    });
  }

  return (
    <TooltipContextProvider>
      <SelectedActionContextProvider>
        <div
          className={`${styles.view} app-view`}
          data-action={viewAction}
          itemScope
          itemType="https://schema.org/Guide"
        >
          <SystemMessage />

          <DetailPanel
            className={styles.detailPanel}
            visible={showDetails}
          />

          <div className={styles.mainPanel}>
            { jobs && <ControlBar /> }

            <div className={styles.container}>
              <div className={`${styles.sidePanel}`} data-active={showControlPanels}>
                { roleActions && actions && (
                  <ActionPanel roleActions={roleActions} actions={actions} />
                ) }
              </div>

              <div className={styles.main} data-readonly={readOnly}>
                { layouts[layoutKey] === 'chotbar'
                  ? <Xbar />
                  : <Hotbar />}
              </div>

              { readOnly && <AdUnit id="ad-AppContainer" className={styles.adUnit} format="largeSkyscraper" /> }
            </div>
          </div>
        </div>

        { session && (
          <Modal onClose={() => closeMarkdownGuide()} showModal={showMarkdownGuide}>
            <MarkdownGuide />
          </Modal>
        )}

        { selectedJob && <Tooltip /> }
      </SelectedActionContextProvider>
    </TooltipContextProvider>
  );
}

export default App;
