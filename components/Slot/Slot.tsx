import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Action from 'components/Action';
import {
  useSelectedActionState,
  useSelectedActionDispatch
} from 'components/SelectedAction';
import { SelectedActionAction } from 'components/SelectedAction/actions';
import { useAppState } from 'components/App/context';
import type { ActionProps } from 'types/Action';
import { setActionToSlot } from 'lib/utils/slots';
import { buildUrl } from 'lib/utils/url';
import styles from './Slot.module.scss';

interface Props {
  id: string,
  className?: string,
  action: ActionProps
}

export default function Slot({ id, className, action }: Props) {
  const {
    viewData,
    readOnly,
    actions,
    roleActions,
    selectedJob
  } = useAppState();
  const {
    layout,
    encodedSlots
  } = viewData;

  const selectedActionDispatch = useSelectedActionDispatch();
  const { selectedAction } = useSelectedActionState();
  const [dragging, setDragging] = useState(false);
  const router = useRouter();

  function resetSlot(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.currentTarget.setAttribute('data-state', 'inactive');
  }

  function handleSlotUpdate(withAction?:ActionProps) {
    const updatedSlots = setActionToSlot({
      action: withAction || {},
      slotID: id,
      encodedSlots,
      layout,
      actions,
      roleActions
    });
    const params = { ...router.query, s: updatedSlots };

    if (selectedJob) {
      const url = buildUrl({ params });
      router.push(url, undefined, { shallow: true });
    }
  }

  function handleDragStart() {
    if (!readOnly) setDragging(true);
  }

  function handleDragLeave(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
    if (dragging) handleSlotUpdate();
    resetSlot(event);
  }

  function handleDragOver(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
    event.currentTarget.setAttribute('data-state', 'active');
  }

  function setSelectedAction() {
    if (readOnly || !id) return null;
    setDragging(false);
    if (selectedAction) handleSlotUpdate(selectedAction);
    selectedActionDispatch({ type: SelectedActionAction.DESELECT });
    return null;
  }

  function handleDrop(event: React.MouseEvent<HTMLDivElement, DragEvent>) {
    event.preventDefault();
    setSelectedAction();
    resetSlot(event);
  }

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div
        id={id}
        className={`${styles.slot} ${className}`}
        onDrop={(event) => handleDrop(event)}
        onDragStart={handleDragStart}
        onDragOver={(event) => handleDragOver(event)}
        onDragLeave={(event) => handleDragLeave(event)}
        onClick={setSelectedAction}
        role="button"
        tabIndex={0}
        data-slotted={!!action?.Name}
        data-disabled={readOnly && !action.Name}
      >
        {action?.Name && <Action action={action} />}
      </div>
    </>
  );
}

Slot.defaultProps = {
  className: ''
};
