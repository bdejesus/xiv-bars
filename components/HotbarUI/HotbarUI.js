import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Xbar from 'components/Xbar';
import Hotbar from 'components/Hotbar';
import Sharing from './Sharing';
import { useXIVBarsState, useXIVBarsDispatch } from '~/XIVBars/context';

import styles from './styles.scss';

function HotbarUI() {
  const router = useRouter();
  const XIVBarsState = useXIVBarsState();
  const XIVBarsDispatch = useXIVBarsDispatch();
  const layoutValue = XIVBarsState.layout;

  useEffect(() => {
    if (router.query && router.query.s) {
      const slottedActions = JSON.parse(router.query.s);
      XIVBarsDispatch({ type: 'loadActionsToSlots', slottedActions });
    }
  }, []);

  function getLayout() {
    if (layoutValue === 1) {
      return 'hotbars';
    }
    return 'xbars';
  }

  const layout = getLayout();

  function toggleHotbarLayout() {
    if (layout === 'xbars') {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, l: 1 }
      });
      XIVBarsDispatch({ type: 'updateLayout', layout: 1 });
    } else {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, l: 0 }
      });
      XIVBarsDispatch({ type: 'updateLayout', layout: 0 });
    }
  }

  function HotbarLayout() {
    if (layout === 'xbars') {
      return <Xbar />;
    }
    return <Hotbar />;
  }

  return (
    <>
      <div className={styles.buttonContainer}>
        <button
          className={`button ${styles.button} ${styles.buttonToggle}`}
          type="button"
          onClick={toggleHotbarLayout}
        >
          <span
            className={styles.label}
            data-selected={layout === 'xbars'}
          >
            <abbr title="W Cross Hotbar">WXHB</abbr>
          </span>
          <span
            className={styles.label}
            data-selected={layout === 'hotbars'}
          >
          Hotbars
          </span>
        </button>
        <Sharing />
      </div>


      <HotbarLayout />
    </>
  );
}

export default HotbarUI;
