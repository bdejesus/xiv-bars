import React from 'react';
import PropTypes from 'prop-types';
import Slot from 'components/Slot';
import { useAppState } from 'components/App/context';
import styles from './Hotbar.module.scss';

function Row({ slots }) {
  return (
    <ol className={styles.row}>
      {Object.keys(slots).map((slot) => (
        <li key={`slot-${slots[slot].id}`}>
          <Slot
            id={slots[slot].id}
            action={slots[slot].action}
            className={styles.slot}
          />
        </li>
      ))}
    </ol>
  );
}

Row.propTypes = {
  slots: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

function Hotbar() {
  const { hotbar } = useAppState();

  return (
    <ol className={styles.container}>
      {Object.keys(hotbar).map((barKey) => (
        <li key={barKey} className={styles.rowWrapper}>
          <Row slots={hotbar[barKey]} />
        </li>
      ))}
    </ol>
  );
}

export default Hotbar;
