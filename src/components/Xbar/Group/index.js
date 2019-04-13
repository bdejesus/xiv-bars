import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Slot from '../Slot';
import styles from './styles.scss';

class Group extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props
    };
    this.updateSlot = this.updateSlot.bind(this);
  }

  componentDidMount() {
    document.addEventListener('dragover', (event) => {
      event.preventDefault();
    }, false);
  }

  updateSlot(slot) {
    const { onUpdateGroup } = this.props;
    onUpdateGroup(slot);
    // const { slots, selectedAction } = this.state;
    // const currentSlots = slots;
    // if (selectedAction) {
    //   currentSlots[slot] = selectedAction;
    // } else {
    //   currentSlots[slot] = { Name: '' };
    // }
    // this.setState({ slots: currentSlots });
    console.log('update');
  }

  render() {
    const { slots, id } = this.state;

    const renderSlot = (slotIndex, index) => (
      <Slot
        key={`${id}-${slots[slotIndex].id}`}
        index={index}
        id={slots[slotIndex].id}
        action={slots[slotIndex].action}
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

Group.propTypes = {
  onUpdateGroup: PropTypes.func.isRequired
};
