import { useState } from 'react';
import { useRouter } from 'next/router';
import { layouts } from 'lib/xbars';
import { useAppState } from 'components/App/context';
import styles from './LayoutToggle.module.scss';

export function LayoutToggle() {
  const router = useRouter();
  const { layout, readOnly, viewAction } = useAppState();
  const [layoutKey, setLayoutKey] = useState(layouts[layout as keyof typeof layouts]);

  function toggleHotbarLayout() {
    const key = layoutKey === 'chotbar' ? layouts[1] : layouts[0];
    const layoutIndex = layouts.indexOf(key).toString();
    setLayoutKey(key);

    if (viewAction === 'new') {
      const { query, pathname } = router;
      const queryParams = { pathname, query: { ...query, l: layoutIndex } };
      router.push(queryParams, undefined, { shallow: true });
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
            data-selected={layoutKey === 'chotbar'}
            data-disabled={readOnly && layoutKey !== 'chotbar'}
          >
            <abbr title="Cross Hotbar">XHB</abbr>
          </span>

          <span
            className={styles.label}
            data-selected={layoutKey === 'hotbar'}
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
