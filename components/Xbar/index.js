/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';
import { group } from 'utils/array';
import Slot from 'components/Slot';
import xBars from 'data/xbars';
import styles from './styles.scss';

const Bar = ({ bar, id }) => {
  const groups = group(bar, 4);

  return (
    <>
      {groups.map((slots, index) => (
        <div className={styles.group} key={`group-${index}`}>
          {slots.map((slot) => (
            <Slot
              id={slot.id}
              key={`slot-${slot.id}`}
              action={slot.action}
              xbar={id}
            />
          ))}
        </div>
      ))}
    </>
  );
};

Bar.propTypes = {
  id: PropTypes.string.isRequired,
  bar: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default function Xbar() {
  const { bars } = xBars;

  return (
    <>
      {Object.keys(bars).map((barGroup) => (
        <div className={`${styles.xbar} ${styles[barGroup]}`} key={barGroup}>
          <Bar bar={bars[barGroup]} id={barGroup} />
        </div>
      ))}
    </>
  );
}
