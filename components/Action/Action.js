/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { createRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTooltipDispatch, updateTooltip } from 'components/Tooltip';
import { useSelectedActionDispatch } from 'components/SelectedAction';

import styles from './Action.module.scss';

let tooltipTimeout = null;

export default function Action({
  action, tooltip, remote
}) {
  const actionRef = createRef();
  const [hovering, setHovering] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({});
  const tooltipDispatch = useTooltipDispatch();
  const selectedActionDispatch = useSelectedActionDispatch();

  useEffect(() => {
    if (actionRef.current) {
      const rect = actionRef.current.getBoundingClientRect();

      setPosition({
        left: rect.left,
        right: rect.left + rect.width,
        top: rect.top,
        bottom: rect.top + rect.height
      });
    }
    return function cleanup() {
      clearTimeout(tooltipTimeout);
    };
  }, [hovering]);

  function handleMouseLeave() {
    clearTimeout(tooltipTimeout);
    setHovering(false);
    tooltipDispatch({ type: 'hide' });
  }

  function handleMouseMove(e) {
    const mouse = { x: e.clientX, y: e.clientY };
    tooltipDispatch({ type: 'updatePosition', mouse });
    clearTimeout(tooltipTimeout);

    tooltipTimeout = setTimeout(() => {
      if (!hovering) {
        const data = {
          action, position, staticContent: tooltip, remote
        };

        setHovering(true);
        if (action.ID) {
          updateTooltip(tooltipDispatch, data);
        }
      }
    }, 150);
  }

  function selectAction() {
    tooltipDispatch({ type: 'hide' });
    selectedActionDispatch({ type: 'selectAction', selectedAction: action });
    setDragging(true);
  }

  function handleDragEnd() {
    setDragging(false);
  }

  const actionType = `${action.UrlType.toLowerCase()}Type`;
  const selectors = `action ${styles.action} ${styles[actionType]} ${dragging ? styles.dragging : undefined}`;

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div
        ref={actionRef}
        className={selectors}
        draggable
        onDragStart={selectAction}
        onDragEnd={handleDragEnd}
        onMouseMove={(e) => handleMouseMove(e)}
        onMouseLeave={handleMouseLeave}
        onBlur={handleMouseLeave}
        role="button"
        onClick={selectAction}
        tabIndex={0}
        data-title={action.Name}
      >
        <div className={styles.iconWrapper}>
          <img
            src={action.customIcon ? action.Icon : `//xivapi.com/${action.Icon}`}
            alt={`${action.Name} Action`}
          />
        </div>
      </div>
    </>
  );
}

Action.propTypes = {
  action: PropTypes.shape().isRequired,
  tooltip: PropTypes.string,
  remote: PropTypes.bool
};

Action.defaultProps = {
  tooltip: undefined,
  remote: true
};
