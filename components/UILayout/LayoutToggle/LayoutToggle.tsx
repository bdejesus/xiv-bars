import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { layouts } from 'lib/xbars';
import { useAppState } from 'components/App/context';
import styles from './LayoutToggle.module.scss';

export function LayoutToggle() {
  const router = useRouter();
  const { layoutId, layout, readOnly } = useAppState();
  const [layoutKey, setLayoutKey] = useState(layouts[layout as keyof typeof layouts]);

  useEffect(() => {
    setLayoutKey(layouts[layout as keyof typeof layouts]);
  }, [layout]);

  function toggleHotbarLayout() {
    const key = layoutKey === 'chotbar' ? layouts[1] : layouts[0];
    const layoutIndex = layouts.indexOf(key).toString();
    const { query, pathname } = router;
    const queryParams = { pathname, query: { ...query, l: layoutIndex, s1: undefined } };
    router.push(queryParams, undefined, { shallow: true });
  }

  return (
    <div className={styles.container}>
      <div className="controlGroup">
        <button
          id="layoutToggle"
          className={`${styles.buttonToggle} button btn-alt`}
          type="button"
          onClick={toggleHotbarLayout}
          disabled={!readOnly && !!layoutId}
        >
          <span
            className={styles.label}
            data-selected={layout === 0}
            data-disabled={readOnly && layoutKey !== 'chotbar'}
          >
            <abbr title="Cross Hotbar">XHB</abbr>
          </span>

          <span
            className={styles.label}
            data-selected={layout === 1}
            data-disabled={readOnly && layoutKey !== 'hotbar'}
          >
            Hotbars
          </span>
        </button>
      </div>
    </div>
  );
}

export default LayoutToggle;
