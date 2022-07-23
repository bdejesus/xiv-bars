import LayoutToggle from 'components/LayoutToggle';
import Xbar from 'components/UILayout/Xbar';
import Hotbar from 'components/UILayout/Hotbar';
import { layouts } from 'lib/xbars';
import { useAppState } from 'components/App/context';
import styles from './UILayout.module.scss';

export function SlotLayout() {
  const { layout } = useAppState();

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

export function UILayout() {
  return (
    <>
      <div className={styles.controls}>
        <LayoutToggle />
      </div>

      <div className={styles.uiLayout}>
        <SlotLayout />
      </div>
    </>
  );
}

export default UILayout;
