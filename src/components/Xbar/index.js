/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { group } from '../../utils/array';
import Slot from './Slot';
import styles from './styles.scss';

class Xbar extends Component {
  render() {
    const { bar, id } = this.props;

    const groups = group(bar, 4);
    return (
      <div className={`${styles.xbar}`} key={id} id={id}>
        {groups.map((slots, index) => (
          <div className={styles.group} key={`group-${index}`}>
            {slots.map(slot => (
              <Slot
                id={slot.id}
                key={`slot-${slot.id}`}
                action={slot.action}
                xbar={id}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
}

export default Xbar;

Xbar.propTypes = {
  bar: PropTypes.arrayOf(PropTypes.object).isRequired,
  id: PropTypes.string.isRequired
};
