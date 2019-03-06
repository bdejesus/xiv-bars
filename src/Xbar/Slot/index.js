import React, { Component } from 'react';
import styles from './styles.scss';

class Slot extends Component {
  render() {
    return (
      <div 
        className={styles.slot}
        title={this.props.action.name}
        onClick={() => this.props.onClick(this.state)}
      > 
        { this.props.action.name }
      </div>
    )
  }
}

export default Slot;
