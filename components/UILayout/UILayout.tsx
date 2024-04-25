import Xbar from 'components/UILayout/Xbar';
import Hotbar from 'components/UILayout/Hotbar';
import { layouts } from 'lib/xbars';
import { useAppState } from 'components/App/context';

import styles from './UILayout.module.scss';

export function UILayout() {
  const { viewData } = useAppState();
  const layoutKey = viewData.layout as keyof typeof layouts;

  return (
    <div className={styles.uiLayout}>
      { layouts[layoutKey] === 'chotbar'
        ? <Xbar />
        : <Hotbar />}
    </div>
  );
}

export default UILayout;
