import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

class Tooltip extends React.PureComponent {
  constructor(props) {
    super(props);
    this.tooltip = React.createRef();
  }

  componentDidUpdate() {
    this.positionTooltip();
  }

  positionTooltip() {
    const tooltipRect = this.tooltip.current.getBoundingClientRect();
    const windowWidth = document.body.clientWidth;
    const hBounds = tooltipRect.width;
    const hPos = (hBounds > windowWidth) ? 'left' : 'right';
    return `${styles[hPos]}`;
  }

  render() {
    const { content, position } = this.props;
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
        className={styles.tooltip}
        style={{ left: position.right, top: position.top }}
        ref={this.tooltip}
      >
        <h4 className={styles.title}>{content.Name}</h4>
        { content.Description.length > 0 && <Description /> }
      </div>
    );
  }
}

export default Tooltip;

Tooltip.propTypes = {
  content: PropTypes.shape().isRequired,
  position: PropTypes.shape().isRequired
};
