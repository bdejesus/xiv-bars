import Xbar from 'components/UILayout/Xbar';
import Hotbar from 'components/UILayout/Hotbar';
import { layouts } from 'lib/xbars';
import { useAppState } from 'components/App/context';
import LayoutToggle from './LayoutToggle';
import styles from './UILayout.module.scss';

export function LayoutView() {
  const { layout } = useAppState();

  switch (layouts[layout as keyof typeof layouts]) {
    case 'chotbar': return <Xbar />;
    case 'hotbar': return <Hotbar />;
    default: return <Xbar />;
  }
}

export function UILayout() {
  return (
    <>
      <div className={styles.controls}>
        <LayoutToggle />
      </div>

      <div className={styles.uiLayout}>
        <LayoutView />
      </div>
    </>
  );
}

export default UILayout;
