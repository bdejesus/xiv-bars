import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Group from './Group';
import styles from './styles.scss';

class Xbar extends PureComponent {
  render() {
    const { bar, id, selectedAction } = this.props;
    return (
      <div className={styles.xbar}>
        {Object.keys(bar).map(group => (
          <Group
            slots={bar[group]}
            key={`${id}-${group}`}
            id={`${id}-${group}`}
            selectedAction={selectedAction}
            onUpdateGroup={event => this.props.onUpdateXBar(event)}
          />
        ))}
      </div>
    );
  }
}

export default Xbar;

Xbar.propTypes = {
  bar: PropTypes.shape.isRequired,
  id: PropTypes.string.isRequired,
  selectedAction: PropTypes.shape
};

Xbar.defaultProps = {
  selectedAction: null
};
