import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppState, useAppDispatch } from 'components/App/context';
import { listJobActions } from 'lib/api';
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
    const { query, pathname } = router;
    const queryParams = {
      pathname,
      query: { ...query, isPvp: viewData.isPvp ? 0 : 1 }
    };

    router.push(queryParams, undefined, { shallow: true });
  }

  useEffect(() => {
    async function getActions(job:ClassJobProps) {
      const actionsToLoad = await listJobActions(job, viewData.isPvp);
      appDispatch({
        type: AppActions.LOAD_JOBACTIONS,
        payload: { actions: actionsToLoad }
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
          PvE
        </abbr>
        <abbr
          className="label"
          data-selected={viewData.isPvp}
          title="Player Versus Player"
        >
          PvP
        </abbr>
      </button>
    </div>
  );
}
