import Xbar from 'components/UILayout/Xbar';
import Hotbar from 'components/UILayout/Hotbar';
import { layouts } from 'lib/xbars';
import LayoutToggle from './LayoutToggle';
import styles from './UILayout.module.scss';

interface Props {
  layout: number
}

export function LayoutView({ layout }:Props) {
  switch (layouts[layout as keyof typeof layouts]) {
    case 'hotbar': return <Hotbar />;
    default: return <Xbar />;
  }
}

export function UILayout(props:Props) {
  return (
    <>
      <div className={styles.controls}>
        <LayoutToggle />
      </div>

      <div className={styles.uiLayout}>
        <LayoutView {...props} />
      </div>
    </>
  );
}

LayoutView.defaultProps = {
  // hotbar: buildHotbars()
};

UILayout.defaultProps = {
  // hotbar: buildHotbars()
};

export default UILayout;
