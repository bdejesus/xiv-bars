/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import { createRef, useState, useEffect } from 'react';
import { useAppState } from 'components/App/context';
import { useTooltipDispatch } from 'components/Tooltip';
import { useSelectedActionDispatch } from 'components/SelectedAction/context';
import { ActionType } from 'types/Action';
import { getContent } from 'lib/api';

import styles from './Action.module.scss';

let tooltipTimeout: NodeJS.Timeout | undefined;

interface Props {
  action: ActionType,
  remote?: boolean
}

const TooltipAction = {
  HIDE: 'hide',
  UPDATE: 'updatePosition',
  START: 'startUpdate',
  FINISH: 'finishUpdate',
  FAIL: 'updateFailed'
};

export function Action({ action, remote = true }: Props) {
  const { showTitles, readOnly } = useAppState();
  const actionRef = createRef<HTMLDivElement>();
  const [hovering, setHovering] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
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

  async function updateTooltip() {
    if (!remote) {
      tooltipDispatch({
        type: TooltipAction.FINISH,
        payload: {
          content: action,
          position
        }
      });
    } else {
      try {
        const content:ActionType = await getContent(action.UrlType, action.ID);

        if (content.Description) {
          tooltipDispatch({ type: TooltipAction.FINISH, payload: { content, position } });
        } else {
          tooltipDispatch({ type: TooltipAction.FINISH, payload: { content: action, position } });
        }
      } catch (error) {
        tooltipDispatch({ type: TooltipAction.FAIL, payload: { error: 'Something went wrong' } });
      }
    }
  }

  function handleMouseLeave() {
    clearTimeout(tooltipTimeout);
    setHovering(false);
    tooltipDispatch({ type: TooltipAction.HIDE });
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const mouse = { x: e.clientX, y: e.clientY };
    tooltipDispatch({ type: 'updatePosition', payload: { mouse } });
    clearTimeout(tooltipTimeout);

    tooltipTimeout = setTimeout(() => {
      if (!hovering) {
        setHovering(true);
        if (action.ID) updateTooltip();
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
