import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Action from 'components/Action';
import {
  useSelectedActionState,
  useSelectedActionDispatch
} from 'components/SelectedAction';

import styles from './styles.scss';

function Slot({ id, className }) {
  const selectedActionDispatch = useSelectedActionDispatch();
  const { selectedAction } = useSelectedActionState();
  const [dragging, setDragging] = useState(false);
  const [action, setAction] = useState({});

  function resetSlot(event) {
    const { currentTarget } = event;
    if (currentTarget.getAttribute('data-state') === 'active') {
      currentTarget.setAttribute('data-state', 'inactive');
    }
  }

  function handleDragStart() {
    setDragging(true);
  }

  function handleDragLeave(event) {
    event.preventDefault();
    if (dragging) { setAction({}); }
    resetSlot(event);
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragging(false);
    setAction(selectedAction);
    selectedActionDispatch({ type: 'deselectAction' });
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
    if (selectedAction) {
      setAction(selectedAction);
      selectedActionDispatch({ type: 'deselectAction' });
    }
    return null;
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
        tabIndex={-1}
      >
        {action.Name && <Action action={action} />}
      </div>
    </>
  );
}

export default Slot;

Slot.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.string
};

Slot.defaultProps = {
  className: ''
};
