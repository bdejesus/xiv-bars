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
        <a 
          href={`https://na.finalfantasyxiv.com/lodestone/playguide/db/item/b2cab67854f/`} 
          className="eorzeadb_link"
        >
          { this.props.action.Name }
        </a>
      </div>
    );
  }
}

export default Item;
