/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { createRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTooltipDispatch, updateTooltip } from 'components/Tooltip';

import styles from './styles.scss';

let tooltipTimeout = null;

export default function Action({ action }) {
  const actionRef = createRef();
  const [hovering, setHovering] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({});
  const tooltipDispatch = useTooltipDispatch();

  useEffect(() => {
    if (actionRef.current) {
      const elRect = actionRef.current.getBoundingClientRect();

      setPosition({
        left: elRect.left,
        right: elRect.left + elRect.width,
        top: elRect.top,
        bottom: elRect.top + elRect.height
      });
    }
    return function cleanup() {
      clearTimeout(tooltipTimeout);
    };
  }, []);

  function handleMouseLeave() {
    clearTimeout(tooltipTimeout);
    setHovering(false);
    tooltipDispatch({ type: 'hide' });
  }

  function handleMouseMove() {
    clearTimeout(tooltipTimeout);

    tooltipTimeout = setTimeout(() => {
      if (!hovering) {
        const data = { action, position };

        setHovering(true);
        if (action.ID) {
          updateTooltip(tooltipDispatch, data);
        }
      }
    }, 300);
  }

  function handleDragStart(event) {
    tooltipDispatch({ type: 'hide' });
    setDragging(true);
    event.dataTransfer.setData('action', JSON.stringify(action));
  }

  function handleDragEnd() {
    setDragging(false);
  }

  return (
    <>
      <div
        ref={actionRef}
        className={`${styles.action} ${dragging ? styles.dragging : ''}`}
        draggable
        onDragStart={(event) => handleDragStart(event)}
        onDragEnd={handleDragEnd}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img src={`//xivapi.com/${action.Icon}`} alt={action.Name} />
      </div>
    </>
  );
}

Action.propTypes = {
  action: PropTypes.shape().isRequired
};
