import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { layouts } from 'lib/xbars';
import { buildUrl } from 'lib/utils/url';
import { useAppState } from 'components/App/context';
import Icon from 'components/Icon';
import styles from './LayoutToggle.module.scss';

export function LayoutToggle() {
  const { t } = useTranslation();
  const router = useRouter();
  const { viewData, readOnly, selectedJob } = useAppState();
  const defaultLayout = layouts[viewData.layout as keyof typeof layouts];
  const [layoutKey, setLayoutKey] = useState(defaultLayout);

  useEffect(() => {
    const updatedLayout = layouts[viewData.layout as keyof typeof layouts];
    setLayoutKey(updatedLayout);
  }, [viewData.layout]);

  function toggleHotbarLayout() {
    const key = layoutKey === 'chotbar' ? layouts[1] : layouts[0];
    const layoutIndex = layouts.indexOf(key).toString();

    if (selectedJob) {
      const query = { ...router.query, l: layoutIndex };
      const url = buildUrl({ query });
      router.push(url, undefined, { shallow: true });
    }
  }

  return (
    <div className={styles.container}>
      <div className="controlGroup">
        <button
          id="layoutToggle"
          className="button btn-alt btn-switch"
          type="button"
          onClick={toggleHotbarLayout}
          disabled={readOnly ? true : undefined}
        >
          <span
            className="label"
            data-selected={viewData.layout === 0}
            data-disabled={readOnly && layoutKey !== 'chotbar'}
          >
            <Icon id="xhb" alt="" />
            <abbr title={t('ControlBar.ToggleLayout.xhb_title')}>
              {t('ControlBar.ToggleLayout.xhb')}
            </abbr>
          </span>

          <span
            className="label"
            data-selected={viewData.layout === 1}
            data-disabled={readOnly && layoutKey !== 'hotbar'}
          >
            <Icon id="hb" alt="" />
            {t('ControlBar.ToggleLayout.hotbars')}
          </span>
        </button>
      </div>
    </div>
  );
}

export default LayoutToggle;
