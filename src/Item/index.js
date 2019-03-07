import React, { Component } from 'react';
import styles from './styles.scss';

class Item extends Component {
  constructor(props) {
    super(props)
    this.state = {
      action: {
        Name: null,
        ID: null
      }
    }
  }

  render() {
    return (
      <div
        className={styles.action}
        draggable
        onDragStart={() => {this.props.dragged(this.props.action)}}
      >
        { this.props.action.Name }
      </div>
    );
  }
}

export default Item;
