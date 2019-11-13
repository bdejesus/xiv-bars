import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Action from 'components/Action';
import styles from './styles.scss';

function Slot({ id }) {
  const [dragging, setDragging] = useState(false);
  const [action, setAction] = useState({});

  const resetSlot = (event) => {
    const { currentTarget } = event;
    if (currentTarget.getAttribute('data-state') === 'active') {
      currentTarget.setAttribute('data-state', 'inactive');
    }
  };

  const handleDragStart = () => {
    setDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    if (dragging) { setAction({}); }
    resetSlot(event);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const actionData = JSON.parse(event.dataTransfer.getData('action'));
    setDragging(false);
    setAction(actionData);
    resetSlot(event);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    const { currentTarget } = event;

    if (currentTarget.getAttribute('data-state') !== 'active') {
      currentTarget.setAttribute('data-state', 'active');
    }
  };

  return (
    <div
      id={id}
      className={styles.slot}
      onDrop={(event) => handleDrop(event)}
      onDragStart={(event) => handleDragStart(event)}
      onDragOver={(event) => handleDragOver(event)}
      onDragLeave={(event) => handleDragLeave(event)}
    >
      {action.Name && <Action action={action} />}
    </div>
  );
}

export default Slot;

Slot.propTypes = {
  id: PropTypes.string.isRequired,
};
