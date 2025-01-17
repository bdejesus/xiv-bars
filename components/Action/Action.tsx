/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { createRef, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useAppState } from 'components/App/context';
import { useTooltipDispatch, TooltipAction } from 'components/Tooltip';
import { useSelectedActionDispatch } from 'components/SelectedAction/context';
import { translateData } from 'lib/utils/i18n.mjs';
import type { ActionProps } from 'types/Action';

import styles from './Action.module.scss';

// eslint-disable-next-line no-undef
let tooltipTimeout: NodeJS.Timeout | undefined;

interface Props {
  action: ActionProps,
  style?: {[key:string]: string}
}

export default function Action({ action, style }: Props) {
  const { locale } = useRouter();
  const { showTitles, readOnly } = useAppState();
  const actionRef = createRef<HTMLDivElement>();
  const [hovering, setHovering] = useState(false);
  const [dragging, setDragging] = useState(false);
  const tooltipDispatch = useTooltipDispatch();
  const selectedActionDispatch = useSelectedActionDispatch();
  const hoverDelay = 160;
  const displayTtile = translateData('Name', action, locale) || action.Name;
  const displayBody = translateData('Description', action, locale) || action.Description;

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

        tooltipDispatch({
          type: TooltipAction.UPDATE,
          payload: {
            title: displayTtile,
            body: displayBody,
            position: mousePosition
          }
        });
      }
    }, hoverDelay);
  }

  function selectAction(e:React.MouseEvent) {
    tooltipDispatch({ type: 'hide' });
    selectedActionDispatch({
      type: 'selectAction',
      payload: { selectedAction: action }
    });
    setDragging(true);

    if (readOnly) e.stopPropagation();
  }

  function handleDragEnd() {
    setDragging(false);
  }

  const actionTypeSelector = action.UrlType ? `${action.UrlType.toLowerCase()}Type` : '';
  const selectors = ['action', styles.action, styles[actionTypeSelector]];
  if (dragging) selectors.push(styles.dragging);

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div
        ref={actionRef}
        className={selectors.join(' ')}
        draggable={!readOnly}
        onDragStart={(e) => selectAction(e)}
        onDragEnd={handleDragEnd}
        onMouseMove={(e) => handleMouseMove(e)}
        onMouseLeave={handleMouseLeave}
        onBlur={handleMouseLeave}
        role="button"
        onClick={(e) => selectAction(e)}
        tabIndex={0}
        data-title={displayTtile}
        data-level={action.Level}
        data-show-title={showTitles}
        style={style}
      >
        <div className={`action-icon-wrapper ${styles.iconWrapper}`}>
          <Image
            src={`/actionIcons/xivapi/${action.Icon!.id}.png`}
            alt={`${displayTtile}`}
            height={40}
            width={40}
            priority
          />
        </div>
      </div>
    </>
  );
}
