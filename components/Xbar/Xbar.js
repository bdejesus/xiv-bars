/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';
import { group } from 'utils';
import Slot from 'components/Slot';
import xBars from 'models/xbars';
import styles from './styles.scss';

const Bar = ({ bar, id }) => (
  <>
    {Object.keys(bar).map((groupName) => {
      const groupSlots = bar[groupName];
      const groups = group(groupSlots, 4);
      return (
        <div className={styles[groupName]} key={groupName}>
          {groups.map((slotGroup, index) => (
            <div className={styles.group} key={`group-${index}`}>
              { slotGroup.map((slot) => (
                <Slot
                  id={slot.id}
                  key={`slot-${slot.id}`}
                  action={slot.action}
                  xbar={id}
                  className={styles.slot}
                />
              ))}
            </div>
          ))}
        </div>
      );
    })}
  </>
);

Bar.propTypes = {
  id: PropTypes.string.isRequired,
  bar: PropTypes.shape().isRequired
};

export default function Xbar() {
  const { bars } = xBars.xBars;

  return (
    <div className={styles.container}>
      {Object.keys(bars).map((barGroup) => (
        <div className={`${styles.xbar} ${styles[barGroup]}`} key={barGroup}>
          <Bar bar={bars[barGroup]} id={barGroup} />
        </div>
      ))}
    </div>
  );
}
