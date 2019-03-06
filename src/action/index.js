import React, { Component } from 'react';
import styles from './styles.scss';

class Action extends Component {
  render() {
    return (
      <div 
        className={styles.action} 
        draggable 
        onDragStart={() => {this.props.dragged(this.props.action)}}
      >
        { this.props.action.name }
      </div>
    );
  }
}

export default Action;
