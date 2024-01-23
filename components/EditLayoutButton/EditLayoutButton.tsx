import { useSession } from 'next-auth/react';
import { useAppState, useAppDispatch } from 'components/App/context';
import { AppAction } from 'components/App/actions';
import Icon from 'components/Icon';

export default function EditLayoutButton() {
  const { data: session } = useSession();
  const { layoutId, readOnly, user } = useAppState();
  const appDispatch = useAppDispatch();
  const canEdit = session?.user.id === user?.id;

  if (!layoutId || !session || !canEdit) return null;

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
      <span className="btn-label-hidden">Edit</span>
    </button>
  );
}
