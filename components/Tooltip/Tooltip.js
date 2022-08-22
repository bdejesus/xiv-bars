import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTooltipState } from './context';

import styles from './Tooltip.module.scss';

function Description({ content }) {
  const cleanDesc = () => {
    const trim = content;
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
}

Description.propTypes = {
  content: PropTypes.string
};

Description.defaultProps = {
  content: undefined
};

export function Tooltip() {
  const [positionStyle, setPositionStyle] = useState({ transform: 'none' });
  const [anchor, setAnchor] = useState('right');
  const { content, position } = useTooltipState();

  useEffect(() => {
    setAnchor(styles.right);
  }, [content]);

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
            <Description content={content.Description} />
          )}
        </>
      )}
    </div>
  );
}

export default Tooltip;
