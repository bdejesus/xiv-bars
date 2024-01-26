import { useRouter } from 'next/router';
import { useAppState } from 'components/App/context';

export default function ActionsToggle() {
  const router = useRouter();
  const { layoutId, readOnly, pvp } = useAppState();
  const isDisabled = (!readOnly && !!layoutId);

  function handleActionsToggle() {
    const { query, pathname } = router;
    const queryParams = {
      pathname,
      query: { ...query, pvp: pvp ? 0 : 1 }
    };

    router.push(queryParams, undefined, { shallow: true });
  }

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
          data-selected={!pvp}
          title="Player Versus Environment"
        >
          PvE
        </abbr>
        <abbr
          className="label"
          data-selected={pvp}
          title="Player Versus Player"
        >
          PvP
        </abbr>
      </button>
    </div>
  );
}
