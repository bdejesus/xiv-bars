/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';
import { group } from 'utils/array';
import Slot from 'components/Slot';
import styles from './styles.scss';

export default function Xbar({ bar, id }) {
  const groups = group(bar, 4);

  return (
    <div className={`${styles.xbar} ${styles[id]}`} key={id}>
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

Xbar.propTypes = {
  bar: PropTypes.arrayOf(PropTypes.object).isRequired,
  id: PropTypes.string.isRequired
};
