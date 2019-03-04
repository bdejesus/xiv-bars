import React, { Component } from 'react';
import styles from './styles.scss';

class Slot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props
    }
  }

  handleClick() {
    const event = {
      ...this.state,
      action: {
        name: 'X'
      }
    }
    this.setState((state) => ({
      action: { name: 'x' }
    }))
    // this.props.onUpdate(event);
  }

  render() {
    const { action } = this.state;

    return (
      <div 
        className={styles.slot}
        title={action.name}
        onClick={() => this.handleClick()}
      > 
        { action.name }
      </div>
    )
  }
}

export default Slot;
