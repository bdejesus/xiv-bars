import React from 'react';
import { useRouter } from 'next/router';
import xbars from 'lib/xbars';
import { useAppState, useAppDispatch } from 'components/App/context';
import styles from './LayoutToggle.module.scss';

function LayoutToggle() {
  const router = useRouter();
  const { layout } = useAppState();
  const appDispatch = useAppDispatch();

  function toggleHotbarLayout() {
    if (xbars.layouts[layout] === 'chotbar') {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, l: 1 }
      });
      appDispatch({ type: 'updateLayout', layout: 1 });
    } else {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, l: 0 }
      });
      appDispatch({ type: 'updateLayout', layout: 0 });
    }
  }

  return (
    <div className={styles.container}>
      <div className="controlGroup">
        <button
          id="layoutToggle"
          className={styles.buttonToggle}
          type="button"
          onClick={toggleHotbarLayout}
        >
          <span
            className={styles.label}
            data-selected={xbars.layouts[layout] === 'chotbar'}
          >
            <abbr title="W Cross Hotbar">WXHB</abbr>
          </span>
          <span
            className={styles.label}
            data-selected={xbars.layouts[layout] === 'hotbar'}
          >
            Hotbars
          </span>
        </button>
      </div>
    </div>
  );
}

export default LayoutToggle;
