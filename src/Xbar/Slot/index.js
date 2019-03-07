import React, { Component } from 'react';
import styles from './styles.scss';

class Slot extends Component {
  render() {
    const handleOnClick = () => {
      this.props.onClick(this.props.index)
    }

    const handleDrop = () => {
      this.props.onDrop(this.props.index)
    }

    return (
      <div
        className={styles.slot}
        title={this.props.action.Name}
        onClick={() => handleOnClick()}
        onDrop={() => handleDrop()}
      >
        { this.props.action.Name }
      </div>
    )
  }
}

export default Slot;
