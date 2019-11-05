import React, { createRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

export default function Tooltip({ content, position }) {
  const tooltip = createRef();
  const [anchor, setAnchor] = useState('left');

  function positionTooltip() {
    const tooltipRect = tooltip.current.getBoundingClientRect();
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
      style={{ left: position.right, top: position.top }}
      ref={tooltip}
    >
      <h4 className={styles.title}>{content.Name}</h4>
      {content.Description.length > 0 && <Description />}
    </div>
  );
}

Tooltip.propTypes = {
  content: PropTypes.shape().isRequired,
  position: PropTypes.shape().isRequired
};
