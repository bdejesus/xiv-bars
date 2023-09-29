import { useEffect, useState } from 'react';
import { useTooltipState } from './context';
import Description from './Description';
import styles from './Tooltip.module.scss';

export function Tooltip() {
  const [positionStyle, setPositionStyle] = useState({ transform: 'none' });
  const [anchor, setAnchor] = useState('right');
  const { content, position } = useTooltipState();

  useEffect(() => {
    setAnchor(styles.right);
  }, [content]);

  useEffect(() => {
    if (position) {
      const posStyle = {
        transform: `translate(${position?.x}px, ${position?.y}px)`
      };
      setPositionStyle(posStyle);
    }
  }, [position]);

  return (
    <div
      className={[styles.tooltip, anchor].join(' ')}
      style={positionStyle}
      aria-hidden={!content?.Name && !content?.Description}
    >
      {content?.Name && (
        <>
          <h4 className={styles.title}>{content.Name}</h4>
          { content.Description && (
            <Description content={content.Description} />
          )}
        </>
      )}
    </div>
  );
}

export default Tooltip;
