import React, { createRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTooltipState } from './context';

import styles from './styles.scss';

function Tooltip({ container }) {
  const tooltipEl = createRef();
  const [anchor, setAnchor] = useState('right');
  const { content, position } = useTooltipState();

  function positionTooltip() {
    if (container.width) {
      const tooltipRect = tooltipEl.current.getBoundingClientRect();
      const containerWidth = container.width;
      const hBounds = tooltipRect.width + tooltipRect.left;
      const hPos = hBounds >= containerWidth ? 'left' : 'right';
      setAnchor(styles[hPos]);
    } else {
      setAnchor(styles.right);
    }
  }

  useEffect(() => {
    positionTooltip();
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

  return (
    <div
      className={`${styles.tooltip} ${anchor}`}
      style={{
        left: position.left - container.left,
        top: position.top - container.top,
      }}
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
