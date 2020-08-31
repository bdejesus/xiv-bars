import React, { useEffect, useState } from 'react';
import { useTooltipState } from './context';

import styles from './Tooltip.styles.module.scss';

function Tooltip() {
  const [positionStyle, setPositionStyle] = useState({ transform: 'none' });
  const [anchor, setAnchor] = useState('right');
  const { content, position } = useTooltipState();

  useEffect(() => {
    setAnchor(styles.right);
  }, [content]);

  const Description = () => {
    const cleanDesc = () => {
      const trim = content.Description;
      const str = trim.replace(/(?:\r\n|\r|\n)/g, '<div>');
      return str;
    };
    const descHtml = { __html: cleanDesc() };

    return (
      <p
        className={styles.description}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={descHtml}
      />
    );
  };

  useEffect(() => {
    const posStyle = {
      transform: `translate(${position.x}px, ${position.y}px)`
    };
    setPositionStyle(posStyle);
  }, [position]);

  return (
    <div
      className={`${styles.tooltip} ${anchor}`}
      style={positionStyle}
      aria-hidden={!content.Name && !content.Description}
    >
      {content.Name && (
        <>
          <h4 className={styles.title}>{content.Name}</h4>
          { content.Description && (
            <Description />
          )}
        </>
      )}
    </div>
  );
}

export default Tooltip;
