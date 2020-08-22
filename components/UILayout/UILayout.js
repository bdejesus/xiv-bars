import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Xbar from 'components/UILayout/Xbar';
import Hotbar from 'components/UILayout/Hotbar';
import { layouts } from 'data/xbars';
import { useAppState, useAppDispatch } from 'components/App/context';
import styles from './styles.module.scss';

function UILayout() {
  const router = useRouter();
  const { layout } = useAppState();
  const XIVBarsDispatch = useAppDispatch();

  useEffect(() => {
    if (router.query && router.query.s) {
      const slottedActions = JSON.parse(router.query.s);
      XIVBarsDispatch({ type: 'loadActionsToSlots', slottedActions });
    }
  }, []);

  function SlotLayout() {
    switch (layouts[layout]) {
      case 'xbars': {
        return <Xbar />;
      }
      case 'hotbars': {
        return <Hotbar />;
      }
      default: {
        throw new Error(`Unknown layout type: ${layout}`);
      }
    }
  }

  return <div className={styles.uiLayout}><SlotLayout /></div>;
}

export default UILayout;
