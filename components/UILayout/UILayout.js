import React, { useEffect } from 'react';
import LayoutToggle from 'components/LayoutToggle';
import Xbar from 'components/UILayout/Xbar';
import Hotbar from 'components/UILayout/Hotbar';
import { layouts } from 'lib/xbars';
import { useAppState, useAppDispatch } from 'components/App/context';
import styles from './UILayout.module.scss';

function UILayout() {
  const { layout, encodedSlots, expandedHotbars } = useAppState();
  const appDispatch = useAppDispatch();

  useEffect(() => {
    if (encodedSlots) {
      appDispatch({
        type: 'bulkLoadActionsToSlots',
        slottedActions: encodedSlots
      });
    }
  }, []);

  function SlotLayout() {
    switch (layouts[layout]) {
      case 'chotbar': {
        return <Xbar />;
      }
      case 'hotbar': {
        return <Hotbar />;
      }
      default: {
        throw new Error(`Unknown layout type: ${layout}`);
      }
    }
  }

  function expandHotbars() {
    appDispatch({
      type: 'expandHotbars',
      expandedHotbars: true
    });
  }

  return (
    <>
      <div className={styles.controls}>
        <LayoutToggle />
      </div>

      <div className={styles.uiLayout}>
        <SlotLayout />

        { !expandedHotbars
          && (
          <button
            title="More Hotbars"
            type="button"
            className={styles.expandButton}
            onClick={expandHotbars}
          >
            <span className={styles.expandLabel}>+</span>
          </button>
          )}
      </div>
    </>
  );
}

export default UILayout;
