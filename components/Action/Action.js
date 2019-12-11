/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { createRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTooltipDispatch, updateTooltip } from '~/app-context';

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

  function hideTooltip() {
    tooltipDispatch({ type: 'hide' });
  }

  function getTooltip() {
    const data = { action, position };
    updateTooltip(tooltipDispatch, data);
  }

  function handleMouseLeave() {
    clearTimeout(tooltipTimeout);
    setHovering(false);
    hideTooltip();
  }

  function handleMouseMove(event) {
    clearTimeout(tooltipTimeout);

    tooltipTimeout = setTimeout(() => {
      if (!hovering) {
        setHovering(true);
        getTooltip(action, event);
      }
    }, 300);
  }

  function handleDragStart(event) {
    hideTooltip();
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
        onMouseMove={(event) => {
          handleMouseMove(event);
        }}
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
