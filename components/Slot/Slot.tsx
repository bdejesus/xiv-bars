import React, { useState } from 'react';
import Action from 'components/Action';
import { useSelectedActionState, useSelectedActionDispatch } from 'components/SelectedAction';
import { SelectedActionAction } from 'components/SelectedAction/actions';
import { useAppState, useAppDispatch } from 'components/App/context';
import { ActionProps } from 'types/Action';
import { AppAction } from 'components/App/actions';
import styles from './Slot.module.scss';

interface Props {
  id: string,
  className?: string,
  action: ActionProps
}

export default function Slot({ id, className, action }: Props) {
  const { readOnly } = useAppState();
  const appDispatch = useAppDispatch();
  const selectedActionDispatch = useSelectedActionDispatch();
  const { selectedAction } = useSelectedActionState();
  const [dragging, setDragging] = useState(false);

  function resetSlot(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const { currentTarget } = event;
    if (currentTarget.getAttribute('data-state') === 'active') {
      currentTarget.setAttribute('data-state', 'inactive');
    }
  }

  function handleDragStart() {
    if (!readOnly) setDragging(true);
  }

  function handleDragLeave(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
    if (dragging) {
      appDispatch({
        type: AppAction.SLOT_ACTION,
        payload: {
          slotID: id,
          action: {}
        }
      });
    }
    resetSlot(event);
  }

  function handleDragOver(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
    const { currentTarget } = event;

    if (currentTarget.getAttribute('data-state') !== 'active') {
      currentTarget.setAttribute('data-state', 'active');
    }
  }

  function setSelectedAction() {
    if (readOnly) return null;

    setDragging(false);
    if (selectedAction) {
      appDispatch({
        type: AppAction.SLOT_ACTION,
        payload: {
          slotID: id,
          action: selectedAction
        }
      });
    }
    selectedActionDispatch({ type: SelectedActionAction.DESELECT });
    return null;
  }

  function handleDrop(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
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
        {action.Name && <Action action={action} />}
      </div>
    </>
  );
}

Slot.defaultProps = {
  className: ''
};
