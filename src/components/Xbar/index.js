import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { group } from '../../utils/array';
import Slot from './Slot';
import styles from './styles.scss';

class Xbar extends PureComponent {
  render() {
    const {
      bar,
      id
    } = this.props;

    const groups = group(bar, 4);

    return (
      <div className={styles.xbar}>
        {groups.map((slots, index) => (
          <div className={styles.group}>
            {slots.map(slot => (
              <Slot id={slot.id} />
            ))}
            {/* <Slot
              key={`${id}-${slots[index].id}`}
              index={index}
              id={slots[index].id}
              action={slots[index].action}
            /> */}
          </div>
        ))}
      </div>
    );
  }
}

export default Xbar;

Xbar.propTypes = {
  bar: PropTypes.shape().isRequired,
  id: PropTypes.string.isRequired
};
