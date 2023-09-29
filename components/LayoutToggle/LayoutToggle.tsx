import { useRouter } from 'next/router';
import { layouts } from 'lib/xbars';
import { useAppState, useAppDispatch } from 'components/App/context';
import styles from './LayoutToggle.module.scss';

export function LayoutToggle() {
  const router = useRouter();
  const { layout, readOnly, viewAction } = useAppState();
  const appDispatch = useAppDispatch();
  const layoutId = layouts[layout as keyof typeof layouts];

  function toggleHotbarLayout() {
    const layoutValue = (layoutId === 'chotbar') ? 1 : 0;

    if (viewAction === 'new') {
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, l: layoutValue }
        },
        undefined,
        { shallow: true }
      );
    }
    appDispatch({ type: 'updateLayout', payload: { layout: layoutValue } });
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
            data-selected={layoutId === 'chotbar'}
            data-disabled={readOnly && layoutId !== 'chotbar'}
          >
            <abbr title="Cross Hotbar">XHB</abbr>
          </span>
          <span
            className={styles.label}
            data-selected={layoutId === 'hotbar'}
            data-disabled={readOnly && layoutId !== 'hotbar'}
          >
            Hotbars
          </span>
        </button>
      </div>
    </div>
  );
}

export default LayoutToggle;
