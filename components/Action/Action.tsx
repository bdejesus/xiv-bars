/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import { createRef, useState } from 'react';
import { useAppState } from 'components/App/context';
import { useTooltipDispatch, TooltipAction } from 'components/Tooltip';
import { useSelectedActionDispatch } from 'components/SelectedAction/context';
import { ActionProps } from 'types/Action';
import { getContent } from 'lib/api';

import styles from './Action.module.scss';

let tooltipTimeout: NodeJS.Timeout | undefined;

interface Props {
  action: ActionProps,
  remote?: boolean
}

export function Action({ action, remote = true }: Props) {
  const { showTitles, readOnly } = useAppState();
  const actionRef = createRef<HTMLDivElement>();
  const [hovering, setHovering] = useState(false);
  const [dragging, setDragging] = useState(false);
  const tooltipDispatch = useTooltipDispatch();
  const selectedActionDispatch = useSelectedActionDispatch();

  async function fetchActionContent(mousePosition: { x: number, y: number}) {
    try {
      const content:ActionProps = await getContent(action.UrlType, action.ID);
      tooltipDispatch({
        type: TooltipAction.UPDATE,
        payload: {
          content: content.Description ? content : action,
          position: mousePosition
        }
      });
    } catch (error) {
      tooltipDispatch({ type: TooltipAction.FAIL, payload: { error: 'Something went wrong' } });
    }
  }

  function handleMouseLeave() {
    clearTimeout(tooltipTimeout);
    setHovering(false);
    tooltipDispatch({ type: TooltipAction.HIDE });
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    clearTimeout(tooltipTimeout);

    tooltipTimeout = setTimeout(() => {
      if (!hovering) {
        setHovering(true);
        const mousePosition = { x: e.clientX, y: e.clientY };

        if (action.ID && remote) fetchActionContent(mousePosition);
        else {
          tooltipDispatch({
            type: TooltipAction.UPDATE,
            payload: { content: action, position: mousePosition }
          });
        }
      }
    }, 160);
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
