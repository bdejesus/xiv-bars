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
import { chotbar, hotbar } from 'lib/xbars';
import styles from './Slot.module.scss';

interface Props {
  id: string,
  className?: string,
  action: ActionProps
}

export default function Slot({ id, className, action }: Props) {
  const { readOnly, layout } = useAppState();
  const selectedActionDispatch = useSelectedActionDispatch();
  const { selectedAction } = useSelectedActionState();
  const [dragging, setDragging] = useState(false);
  const router = useRouter();

  const { query, pathname } = router;
  const slotLayouts = [chotbar, hotbar];
  const slots = slotLayouts[layout ? parseInt(layout.toString(), 10) : 0];

  function resetSlot(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.currentTarget.setAttribute('data-state', 'inactive');
  }

  function handleDragStart() {
    if (!readOnly) setDragging(true);
  }

  function handleDragLeave(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
    if (dragging) {
      // Update URL route
      const updatedSlots = setActionToSlot({
        action: {},
        slotID: id,
        slots
      });

      const params = { pathname, query: { ...query, s1: updatedSlots } };
      router.push(params, undefined, { shallow: true });
    }
    resetSlot(event);
  }

  function handleDragOver(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
    event.currentTarget.setAttribute('data-state', 'active');
  }

  function setSelectedAction() {
    if (readOnly || !id) return null;

    setDragging(false);

    if (selectedAction) {
      // Update URL route
      const updatedSlots = setActionToSlot({
        action: selectedAction,
        slotID: id,
        slots
      });

      const params = { pathname, query: { ...query, s1: updatedSlots } };
      router.push(params, undefined, { shallow: true });
    }

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
