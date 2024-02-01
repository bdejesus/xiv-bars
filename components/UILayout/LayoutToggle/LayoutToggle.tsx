import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { layouts } from 'lib/xbars';
import { useAppState } from 'components/App/context';
import styles from './LayoutToggle.module.scss';

export function LayoutToggle() {
  const router = useRouter();
  const { viewData, readOnly } = useAppState();
  const defaultLayout = layouts[viewData.layout as keyof typeof layouts];
  const [layoutKey, setLayoutKey] = useState(defaultLayout);

  useEffect(() => {
    const updatedLayout = layouts[viewData.layout as keyof typeof layouts];
    setLayoutKey(updatedLayout);
  }, [viewData.layout]);

  function toggleHotbarLayout() {
    const key = layoutKey === 'chotbar' ? layouts[1] : layouts[0];
    const layoutIndex = layouts.indexOf(key).toString();
    const { query, pathname } = router;
    const queryParams = { pathname, query: { ...query, l: layoutIndex } };

    router.push(queryParams, undefined, { shallow: true });
  }

  return (
    <div className={styles.container}>
      <div className="controlGroup">
        <button
          id="layoutToggle"
          className="button btn-alt btn-switch"
          type="button"
          onClick={toggleHotbarLayout}
          disabled={!readOnly && !!viewData.id}
        >
          <span
            className="label"
            data-selected={viewData.layout === 0}
            data-disabled={readOnly && layoutKey !== 'chotbar'}
          >
            <abbr title="Cross Hotbar">XHB</abbr>
          </span>

          <span
            className="label"
            data-selected={viewData.layout === 1}
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
