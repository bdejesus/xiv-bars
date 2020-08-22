import React, { createRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTooltipState } from './context';

import styles from './styles.module.scss';

function Tooltip({ container }) {
  const tooltipEl = createRef();
  const [positionStyle, setPositionStyle] = useState({ transform: 'none' });
  const [anchor, setAnchor] = useState('right');
  const { content, position } = useTooltipState();

  useEffect(() => {
    // positionTooltip();
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
      ref={tooltipEl}
      aria-hidden={!content.Name && !content.Description}
    >
      {content.Name && content.Description && (
        <>
          <h4 className={styles.title}>{content.Name}</h4>
          <Description />
        </>
      )}
    </div>
  );
}

Tooltip.propTypes = {
  container: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
    width: PropTypes.number
  }).isRequired
};

export default Tooltip;
