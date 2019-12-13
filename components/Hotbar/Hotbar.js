import React from 'react';
import PropTypes from 'prop-types';
import Slot from 'components/Slot';
import xBars from 'models/xbars';
import styles from './styles.scss';

function Row({ slots }) {
  return (
    <ol className={styles.row}>
      {Object.keys(slots).map((slot) => (
        <li key={`slot-${slots[slot].id}`}>
          <Slot id={slots[slot].id} />
        </li>
      ))}
    </ol>
  );
}

Row.propTypes = {
  slots: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

function Hotbar() {
  const { bars } = xBars.hotbars;
  return (
    <ol className={styles.container}>
      {Object.keys(bars).map((barKey) => (
        <li key={barKey} className={styles.rowWrapper}>
          <Row slots={bars[barKey]} />
        </li>
      ))}
    </ol>
  );
}

export default Hotbar;
