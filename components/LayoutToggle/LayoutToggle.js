import { useRouter } from 'next/router';
import { layouts } from 'lib/xbars';
import { useAppState, useAppDispatch } from 'components/App/context';
import styles from './LayoutToggle.module.scss';

export function LayoutToggle() {
  const router = useRouter();
  const { layout, readOnly } = useAppState();
  const appDispatch = useAppDispatch();

  function toggleHotbarLayout() {
    if (layouts[layout] === 'chotbar') {
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
          disabled={readOnly}
        >
          <span
            className={styles.label}
            data-selected={layouts[layout] === 'chotbar'}
            data-disabled={readOnly && layouts[layout] !== 'chotbar'}
          >
            <abbr title="Cross Hotbar">XHB</abbr>
          </span>
          <span
            className={styles.label}
            data-selected={layouts[layout] === 'hotbar'}
            data-disabled={readOnly && layouts[layout] !== 'hotbar'}
          >
            Hotbars
          </span>
        </button>
      </div>
    </div>
  );
}

export default LayoutToggle;
