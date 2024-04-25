import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Action from 'components/Action';
import {
  useSelectedActionState,
  useSelectedActionDispatch
} from 'components/SelectedAction';
import { SelectedActionAction } from 'components/SelectedAction/actions';
import { useAppState, useAppDispatch } from 'components/App/context';
import { AppActions } from 'components/App/actions';
import Icon, { Icons } from 'components/Icon';
import type { ActionProps } from 'types/Action';
import { setActionToSlot } from 'lib/utils/slots';
import { buildUrl } from 'lib/utils/url';
import styles from './Slot.module.scss';

interface Props {
  id: string,
  className?: string,
  action: ActionProps
}

type ButtonEventProps = React.MouseEvent<HTMLDivElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

export default function Slot({ id, className, action }: Props) {
  const {
    viewData,
    readOnly,
    actions,
    roleActions,
    selectedJob
  } = useAppState();
  const appDispatch = useAppDispatch();
  const {
    layout,
    encodedSlots
  } = viewData;

  const selectedActionDispatch = useSelectedActionDispatch();
  const { selectedAction } = useSelectedActionState();
  const [dragging, setDragging] = useState(false);
  const router = useRouter();

  function resetSlot(event:ButtonEventProps) {
    event.currentTarget.setAttribute('data-state', 'inactive');
  }

  function handleSlotUpdate(withAction?:ActionProps) {
    const updatedSlots = setActionToSlot({
      action: withAction,
      slotID: id,
      encodedSlots,
      layout,
      actions,
      roleActions
    });

    if (selectedJob) {
      const url = buildUrl({
        query: router.query,
        mergeData: { s: updatedSlots }
      });
      appDispatch({
        type: AppActions.SLOT_ACTION,
        payload: { action: withAction, slotID: id }
      });
      if (!viewData.id) router.push(url, undefined, { shallow: true });
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

  function setSelectedAction(withAction:boolean = true) {
    setDragging(false);
    if (!readOnly || !!id) {
      if (selectedAction && withAction) {
        handleSlotUpdate(selectedAction);
      } else {
        handleSlotUpdate();
      }
      selectedActionDispatch({ type: SelectedActionAction.DESELECT });
    }
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
        className={`${styles.slot} ${className} slot`}
        onDrop={(event) => handleDrop(event)}
        onDragStart={handleDragStart}
        onDragOver={(event) => handleDragOver(event)}
        onDragLeave={(event) => handleDragLeave(event)}
        onClick={() => setSelectedAction()}
        role="button"
        tabIndex={0}
        data-slotted={!!action?.Name}
        data-disabled={readOnly && !action?.Name}
      >
        { action?.Name && <Action action={action} /> }

        { !readOnly && action?.Name && (
          <button
            type="button"
            className={[styles.removeBtn, 'button btn-sm btn-icon'].join(' ')}
            onClick={(e) => resetSlot(e)}
          >
            <Icon id={Icons.REMOVE} alt="Remove" />
            <span className="btn-label-hidden">Remove</span>
          </button>
        )}
      </div>
    </>
  );
}

Slot.defaultProps = {
  className: ''
};
