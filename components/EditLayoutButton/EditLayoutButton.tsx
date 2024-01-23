import { useAppState, useAppDispatch } from 'components/App/context';
import { AppAction } from 'components/App/actions';
import Icon from 'components/Icon';

export default function EditLayoutButton() {
  const { layoutId, readOnly } = useAppState();
  const appDispatch = useAppDispatch();

  if (!layoutId) return null;

  function handleEditLayout() {
    appDispatch({ type: AppAction.EDIT_LAYOUT });
  }

  return (
    <button
      type="button"
      className="button btn-icon"
      onClick={handleEditLayout}
      title="Edit Layout"
      disabled={!readOnly}
    >
      <Icon id="edit" title="Edit" />
    </button>
  );
}
