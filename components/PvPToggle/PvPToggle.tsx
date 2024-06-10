import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useSystemState, useSystemDispatch } from 'components/System/context';
import { systemActions } from 'components/System/actions';
import { useAppState, useAppDispatch } from 'components/App/context';
import { buildUrl } from 'lib/utils/url';
import Icon from 'components/Icon';
import { appActions } from 'components/App/actions';
import type { ClassJobProps } from 'types/ClassJob';

export default function PvPToggle() {
  const { isLoading } = useSystemState();
  const systemDispatch = useSystemDispatch();
  const { t } = useTranslation();
  const router = useRouter();
  const appDispatch = useAppDispatch();
  const {
    viewData,
    selectedJob,
    readOnly
  } = useAppState();
  const isDisabled = (readOnly && !!viewData.id);

  function handleTogglePvP() {
    if (selectedJob) {
      const url = buildUrl({
        query: router.query,
        mergeData: { isPvp: !viewData.isPvp }
      });
      router.push(url, undefined, { shallow: true });
    }
  }

  useEffect(() => {
    async function getActions() {
      systemDispatch({ type: systemActions.LOADING_START });
      const fetchActions = await fetch(`/api/actions?job=${selectedJob!.Abbr}&isPvp=${viewData.isPvp}`);
      const actionsJson = await fetchActions.json();
      appDispatch({ type: appActions.LOAD_JOBACTIONS, payload: actionsJson });
      systemDispatch({ type: systemActions.LOADING_END });
    }

    if (selectedJob) getActions();
  }, [viewData.isPvp]);

  return (
    <div>
      <button
        type="button"
        className="button btn-alt btn-switch"
        onClick={handleTogglePvP}
        disabled={(isDisabled || isLoading) ? true : undefined}
      >
        <abbr
          className="label"
          data-selected={!viewData.isPvp}
          title={t('ControlBar.PvpToggle.pve_title')}
        >
          <Icon id="pve" alt="" />
          {t('ControlBar.PvpToggle.pve_abbr')}
        </abbr>
        <abbr
          className="label"
          data-selected={viewData.isPvp}
          title={t('ControlBar.PvpToggle.pvp_title')}
        >
          <Icon id="pvp" alt="" />
          {t('ControlBar.PvpToggle.pvp_abbr')}
        </abbr>
      </button>
    </div>
  );
}
