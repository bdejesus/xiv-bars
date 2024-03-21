import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppState, useAppDispatch } from 'components/App/context';
import { listJobActions, listRoleActions } from 'lib/api/actions';
import { buildUrl } from 'lib/utils/url';
import Icon from 'components/Icon';
import { AppActions } from 'components/App/actions';
import type { ClassJobProps } from 'types/ClassJob';

export default function PvPToggle() {
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
    async function getActions(job:ClassJobProps) {
      const actionsToLoad = await listJobActions(job, viewData.isPvp);
      const roleActionsToLoad = await listRoleActions(job, viewData.isPvp);
      appDispatch({
        type: AppActions.LOAD_JOBACTIONS,
        payload: { actions: actionsToLoad, roleActions: roleActionsToLoad }
      });
    }

    if (selectedJob) getActions(selectedJob);
  }, [viewData.isPvp]);

  return (
    <div>
      <button
        type="button"
        className="button btn-alt btn-switch"
        onClick={handleTogglePvP}
        disabled={isDisabled ? true : undefined}
      >
        <abbr
          className="label"
          data-selected={!viewData.isPvp}
          title="Player Versus Environment"
        >
          <Icon id="pve" alt="" />
          PvE
        </abbr>
        <abbr
          className="label"
          data-selected={viewData.isPvp}
          title="Player Versus Player"
        >
          <Icon id="pvp" alt="" />
          PvP
        </abbr>
      </button>
    </div>
  );
}
