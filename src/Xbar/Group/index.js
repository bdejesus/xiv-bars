import React, { Component } from 'react';
import Slot from '../Slot';
import styles from './styles.scss';

class Group extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...props
    }

    this.updateSlot = this.updateSlot.bind(this)
  }

  updateSlot(event) {
    this.setState((state) => ({
      slots: {
        ...state.slots,
        [event.slot]: event.action
      }
    }))
  }

  render() {
    const { slots, id } = this.state;
    return(
      <div className={styles.xbarGroup} key={`${id}`}>
        {Object.keys(slots).map((slot, index) => {
          return (
            <Slot 
              key={`${id}-slot-${index + 1}`} 
              action={slots[slot]}
              onUpdate={this.updateSlot} 
              slot={slot}
            />
          )
        })}
      </div>
    )
  }
}

export default Group;
