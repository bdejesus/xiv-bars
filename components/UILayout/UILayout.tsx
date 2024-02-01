import Xbar from 'components/UILayout/Xbar';
import Hotbar from 'components/UILayout/Hotbar';
import { layouts } from 'lib/xbars';
import { useAppState } from 'components/App/context';

import styles from './UILayout.module.scss';

export function LayoutView() {
  const { viewData } = useAppState();

  switch (layouts[viewData.layout as keyof typeof layouts]) {
    case 'chotbar': return <Xbar />;
    case 'hotbar': return <Hotbar />;
    default: return <Xbar />;
  }
}

export function UILayout() {
  return (
    <div className={styles.uiLayout}>
      <LayoutView />
    </div>
  );
}

export default UILayout;
