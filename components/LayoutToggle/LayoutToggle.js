import React from 'react';
import { useRouter } from 'next/router';
import { layouts } from 'data/xbars';
import { useAppState, useAppDispatch } from 'components/App/context';
import styles from './styles.module.scss';

function LayoutToggle() {
  const router = useRouter();
  const { layout } = useAppState();
  const XIVBarsDispatch = useAppDispatch();

  function toggleHotbarLayout() {
    if (layouts[layout] === 'xbars') {
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

  return (
    <div className={styles.container}>
      <div className="controlGroup">
        <label htmlFor="layoutToggle">Layout</label>
        <button
          id="layoutToggle"
          className={`button ${styles.button} ${styles.buttonToggle}`}
          type="button"
          onClick={toggleHotbarLayout}
        >
          <span
            className={styles.label}
            data-selected={layouts[layout] === 'xbars'}
          >
            <abbr title="W Cross Hotbar">WXHB</abbr>
          </span>
          <span
            className={styles.label}
            data-selected={layouts[layout] === 'hotbars'}
          >
            Hotbars
          </span>
        </button>
      </div>
    </div>
  );
}

export default LayoutToggle;
