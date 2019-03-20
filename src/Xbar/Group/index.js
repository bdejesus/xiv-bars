import React, { Component } from 'react';
import Slot from '../Slot';
import styles from './styles.scss';

class Group extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props,
    };
    this.updateSlot = this.updateSlot.bind(this);
  }

  componentDidMount() {
    document.addEventListener('dragover', (event) => {
      event.preventDefault();
    }, false);
  }

  updateSlot(slot) {
    const { slots, selectedAction } = this.props;
    const currentSlots = slots.slice();
    if (selectedAction) {
      currentSlots[slot] = selectedAction;
    } else {
      currentSlots[slot] = { Name: '' };
    }
    this.setState({ slots: currentSlots });
  }

  render() {
    const { slots, id } = this.props;

    const renderSlot = (slot, index) => (
      <Slot
        key={`${id}-slot-${slot}`}
        index={index}
        action={slots[slot]}
        onClick={thisSlot => this.updateSlot(thisSlot)}
        onDrop={thisSlot => this.updateSlot(thisSlot)}
      />
    );

    return (
      <div className={styles.xbarGroup} key={`${id}`}>
        {Object.keys(slots).map((slot, index) => renderSlot(slot, index))}
      </div>
    );
  }
}

export default Group;
