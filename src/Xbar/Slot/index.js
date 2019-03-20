import React, { PureComponent } from 'react';
import styles from './styles.scss';

class Slot extends PureComponent {
  render() {
    const {
      action, index, onClick, onDrop,
    } = this.props;
    const handleOnClick = () => onClick(index);
    const handleDrop = () => onDrop(index);

    return (
      <div
        className={styles.slot}
        title={action.Name}
        onClick={() => handleOnClick()}
        onDrop={() => handleDrop()}
        role="button"
      >
        { action.Name }
      </div>
    );
  }
}

export default Slot;
