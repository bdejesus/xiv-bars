/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { createRef, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useAppState } from 'components/App/context';
import { useTooltipDispatch, TooltipAction } from 'components/Tooltip';
import { useSelectedActionDispatch } from 'components/SelectedAction/context';
import { localizeKey } from 'lib/utils/i18n';
import type { ActionProps } from 'types/Action';

import styles from './Action.module.scss';

// eslint-disable-next-line no-undef
let tooltipTimeout: NodeJS.Timeout | undefined;

interface Props {
  action: ActionProps
}

export default function Action({ action }: Props) {
  const { locale } = useRouter();
  const { showTitles, readOnly } = useAppState();
  const actionRef = createRef<HTMLDivElement>();
  const [hovering, setHovering] = useState(false);
  const [dragging, setDragging] = useState(false);
  const tooltipDispatch = useTooltipDispatch();
  const selectedActionDispatch = useSelectedActionDispatch();
  const hoverDelay = 160;

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
        const titleKey = localizeKey('Name', locale) as keyof typeof action;
        const bodyKey = localizeKey('Description', locale) as keyof typeof action;
        tooltipDispatch({
          type: TooltipAction.UPDATE,
          payload: {
            title: action[titleKey] as string,
            body: action[bodyKey] as string,
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
  const selectors = `action ${styles.action} ${styles[actionTypeSelector]} ${dragging ? styles.dragging : undefined}`;
  const localeKey = localizeKey('Name', locale);
  const displayName = action[localeKey as keyof typeof action] || action['Name' as keyof typeof action];

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div
        ref={actionRef}
        className={selectors}
        draggable={!readOnly}
        onDragStart={(e) => selectAction(e)}
        onDragEnd={handleDragEnd}
        onMouseMove={(e) => handleMouseMove(e)}
        onMouseLeave={handleMouseLeave}
        onBlur={handleMouseLeave}
        role="button"
        onClick={(e) => selectAction(e)}
        tabIndex={0}
        data-title={displayName}
        data-show-title={showTitles}
      >
        <div className={styles.iconWrapper}>
          <Image
            src={action.customIcon ? action.Icon as string : `https://xivapi.com/${action.Icon}`}
            alt={`${displayName}`}
            height={40}
            width={40}
          />
        </div>
      </div>
    </>
  );
}
