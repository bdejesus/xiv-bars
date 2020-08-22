/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';
import { group } from 'lib/utils';
import Slot from 'components/Slot';
import { useAppState } from 'components/App/context';
import styles from './styles.module.scss';

export default function Xbar() {
  const { xbars } = useAppState();

  return (
    <div className={styles.container}>
      {Object.keys(xbars).map((xbar) => (
        <div className={`${styles.xbar} ${styles[xbar]}`} key={xbar}>
          <Bar bar={xbars[xbar]} id={xbar} />
        </div>
      ))}
    </div>
  );
}

function Set({ slots }) {
  return (
    <div className={styles.set}>
      { slots.map((slot) => (
        <Slot
          id={slot.id}
          key={`slot-${slot.id}`}
          action={slot.action}
          className={styles.slot}
        />
      ))}
    </div>
  );
}

Set.propTypes = {
  slots: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

function Group({ slots }) {
  const slotSets = group(slots, 4);
  return (
    <>
      {slotSets.map((groupSlots, index) => (
        <Set slots={groupSlots} key={`set-${index}`} />
      ))}
    </>
  );
}

Group.propTypes = {
  slots: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

function Bar({ bar }) {
  const barGroups = {
    left: bar.slice(0, 8),
    right: bar.slice(8, bar.length + 1)
  };

  return (
    <>
      {Object.keys(barGroups).map((slots, index) => (
        <div className={styles[slots]} key={`group-${index}`}>
          <Group slots={barGroups[slots]} />
        </div>
      ))}
    </>
  );
}

Bar.propTypes = {
  bar: PropTypes.arrayOf(PropTypes.shape()).isRequired
};
