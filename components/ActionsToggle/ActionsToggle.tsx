import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppState, useAppDispatch } from 'components/App/context';
import { listJobActions } from 'lib/api';
import { AppAction } from 'components/App/actions';
import type { ClassJobProps } from 'types/ClassJob';

export default function ActionsToggle() {
  const router = useRouter();
  const appDispatch = useAppDispatch();
  const {
    selectedJob,
    layoutId,
    readOnly,
    pvp
  } = useAppState();
  const isDisabled = (!readOnly && !!layoutId);

  function handleActionsToggle() {
    const { query, pathname } = router;
    const queryParams = {
      pathname,
      query: { ...query, pvp: pvp === 0 ? 1 : 0 }
    };

    router.push(queryParams, undefined, { shallow: true });
  }

  useEffect(() => {
    async function getActions(job:ClassJobProps) {
      const actionsToLoad = await listJobActions(job, pvp);
      appDispatch({
        type: AppAction.LOAD_JOBACTIONS,
        payload: { actions: actionsToLoad }
      });
    }

    if (selectedJob) getActions(selectedJob);
  }, [pvp]);

  return (
    <div>
      <button
        type="button"
        className="button btn-alt btn-switch"
        onClick={handleActionsToggle}
        disabled={isDisabled}
      >
        <abbr
          className="label"
          data-selected={pvp === 0}
          title="Player Versus Environment"
        >
          PvE
        </abbr>
        <abbr
          className="label"
          data-selected={pvp === 1}
          title="Player Versus Player"
        >
          PvP
        </abbr>
      </button>
    </div>
  );
}
