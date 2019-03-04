import React, { Component } from 'react';
import styles from './styles.scss';

class Action extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props
    }
  }

  handleOnDrag(e) {
    console.log(e);
  }

  render() {
    return (
      <div 
        className={styles.action} 
        draggable 
        onDrag={this.handleOnDrag}
      >
        Action
      </div>
    );
  }
}

export default Action;
