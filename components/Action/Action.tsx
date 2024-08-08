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
  action: ActionProps
}

export default function Action({ action }:Props) {
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

  function selectAction() {
    tooltipDispatch({ type: 'hide' });
    selectedActionDispatch({ type: 'selectAction', payload: { selectedAction: action } });
    setDragging(true);
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

  function handleMouseLeave() {
    clearTimeout(tooltipTimeout);
    setHovering(false);
    tooltipDispatch({ type: TooltipAction.HIDE });
  }

  function handleClick(e:React.MouseEvent<HTMLDivElement, MouseEvent>) {
    selectAction();
    if (readOnly) e.stopPropagation();
  }

  function handleDragStart(e:React.DragEvent<HTMLDivElement>) {
    const image = actionRef.current?.querySelector('img');
    if (image) e.dataTransfer.setDragImage(image, 20, 20);
    selectAction();
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
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onBlur={handleMouseLeave}
        role="button"
        onClick={(e) => handleClick(e)}
        tabIndex={0}
        data-title={displayTtile}
        data-show-title={showTitles}
        id={action.ID as string}
      >
        <div className={`action-icon-wrapper ${styles.iconWrapper}`}>
          <Image
            src={action.customIcon ? action.Icon as string : `https://xivapi.com/${action.Icon}`}
            alt={`${displayTtile}`}
            height={40}
            width={40}
          />
        </div>
      </div>
    </>
  );
}
