import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Action from 'components/Action';
import {
  useSelectedActionState,
  useSelectedActionDispatch
} from 'components/SelectedAction';
import { useAppState, useAppDispatch } from 'components/App/context';

import styles from './Slot.module.scss';

function Slot({ id, className, action }) {
  const { readOnly } = useAppState();
  const appDispatch = useAppDispatch();
  const selectedActionDispatch = useSelectedActionDispatch();
  const { selectedAction } = useSelectedActionState();
  const [dragging, setDragging] = useState(false);

  function resetSlot(event) {
    const { currentTarget } = event;
    if (currentTarget.getAttribute('data-state') === 'active') {
      currentTarget.setAttribute('data-state', 'inactive');
    }
  }

  function handleDragStart() {
    if (!readOnly) setDragging(true);
  }

  function handleDragLeave(event) {
    event.preventDefault();
    if (dragging) {
      appDispatch({
        type: 'setActionToSlot',
        slotID: id,
        action: {}
      });
    }
    resetSlot(event);
  }

  function handleDragOver(event) {
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
        type: 'setActionToSlot',
        slotID: id,
        action: selectedAction
      });
    }
    selectedActionDispatch({ type: 'deselectAction' });
    return null;
  }

  function handleDrop(event) {
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
        onDragStart={(event) => handleDragStart(event)}
        onDragOver={(event) => handleDragOver(event)}
        onDragLeave={(event) => handleDragLeave(event)}
        onClick={setSelectedAction}
        role="button"
        tabIndex={0}
        data-slotted={!!action.Name}
        data-disabled={readOnly && !action.Name}
      >
        {action.Name && <Action action={action} />}
      </div>
    </>
  );
}

export default Slot;

Slot.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  action: PropTypes.shape()
};

Slot.defaultProps = {
  className: '',
  action: undefined
};
