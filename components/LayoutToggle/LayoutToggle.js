import { useRouter } from 'next/router';
import { layouts } from 'lib/xbars';
import { useAppState, useAppDispatch } from 'components/App/context';
import styles from './LayoutToggle.module.scss';

export function LayoutToggle() {
  const router = useRouter();
  const { layout, readOnly } = useAppState();
  const appDispatch = useAppDispatch();

  function toggleHotbarLayout() {
    const layoutValue = (layouts[layout] === 'chotbar') ? 1 : 0;
    router.push({ pathname: router.pathname, query: { ...router.query, l: layoutValue } });
    appDispatch({ type: 'updateLayout', layout: layoutValue });
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
