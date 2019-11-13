import React, { createRef, useEffect, useState } from 'react';
import { useTooltipState } from '~/app-context';

import styles from './styles.scss';

export default function Tooltip() {
  const tooltipEl = createRef();
  const [anchor, setAnchor] = useState('left');
  const { content, position } = useTooltipState();

  function positionTooltip() {
    const tooltipRect = tooltipEl.current.getBoundingClientRect();
    const windowWidth = document.body.clientWidth;
    const hBounds = tooltipRect.width + tooltipRect.left;
    const hPos = hBounds >= windowWidth ? 'left' : 'right';
    setAnchor(styles[hPos]);
  }

  useEffect(() => {
    positionTooltip();
  }, []);

  const Description = () => {
    const cleanDesc = content.Description.trim();
    const descHtml = { __html: cleanDesc };

    return (
      <p
        className={styles.description}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={descHtml}
      />
    );
  };

  return (
    <div
      className={`${styles.tooltip} ${anchor}`}
      style={{ left: position.left, top: position.top }}
      ref={tooltipEl}
      aria-hidden={(!content.Name && !content.Description)}
    >
      {(content.Name && content.Description) && (
        <>
          <h4 className={styles.title}>{content.Name}</h4>
          <Description />
        </>
      )}
    </div>
  );
}
