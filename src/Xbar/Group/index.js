import React, { Component } from 'react';
import Slot from '../Slot';
import styles from './styles.scss';

class Group extends Component {
  render() {
    const { slots, id } = this.props;
    return(
      <div className={styles.xbarGroup} key={`${id}`}>
        {Object.keys(slots).map((slot, index) => {
          return (
            <Slot 
              key={`${id}-slot-${index + 1}`} 
              value={slots[slot]}
              onUpdate={this.updateSlot} 
            />
          )
        })}
      </div>
    )
  }
}

export default Group;
