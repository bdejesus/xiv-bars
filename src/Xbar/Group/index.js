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

  updateSlot(slot) {
    const slots = this.state.slots.slice()
    slots[slot] = this.props.selectedAction
    this.setState({slots: slots})
  }

  componentDidMount() {
    document.addEventListener("dragover", function( event ) {
      event.preventDefault()
    }, false)
  }

  render() {
    const { slots, id } = this.state

    const renderSlot = (slot, index) => {
      return (
        <Slot 
          key={`${id}-slot-${slot}`} 
          index={index}
          action={slots[slot]}
          onClick={() => this.updateSlot(slot)} 
          onDrop={(slot) => this.updateSlot(slot)}
        />
      )
    }

    return(
      <div className={styles.xbarGroup} key={`${id}`}>
        {Object.keys(slots).map((slot, index) => {
          return renderSlot(slot, index)
        })}
      </div>
    )
  }
}

export default Group;
