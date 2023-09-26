/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import { createRef, useState, useEffect } from 'react';
import { useAppState } from 'components/App/context';
import { useTooltipDispatch, updateTooltip } from 'components/Tooltip';
import { useSelectedActionDispatch } from 'components/SelectedAction';
import { ActionType } from 'types/Action';

import styles from './Action.module.scss';

let tooltipTimeout: NodeJS.Timeout | undefined;

interface Props {
  action: ActionType,
  tooltip?: object,
  remote?: boolean
}

export function Action({ action, tooltip, remote }: Props) {
  const { showTitles, readOnly } = useAppState();
  const actionRef = createRef<HTMLDivElement>();
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

    return () => clearTimeout(tooltipTimeout);
  }, [hovering]);

  function handleMouseLeave() {
    clearTimeout(tooltipTimeout);
    setHovering(false);
    tooltipDispatch({ type: 'hide' });
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
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
        draggable={!readOnly}
        onDragStart={selectAction}
        onDragEnd={handleDragEnd}
        onMouseMove={(e) => handleMouseMove(e)}
        onMouseLeave={handleMouseLeave}
        onBlur={handleMouseLeave}
        role="button"
        onClick={selectAction}
        tabIndex={0}
        data-title={action.Name}
        data-show-title={showTitles}
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

export default Action;
