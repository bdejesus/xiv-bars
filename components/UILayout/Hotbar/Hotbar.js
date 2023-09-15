import { useState } from 'react';
import PropTypes from 'prop-types';
import Slot from 'components/Slot';
import { useAppState, useAppDispatch } from 'components/App/context';
import styles from './Hotbar.module.scss';

function LayoutControl({ handler }) {
  return (
    // eslint-disable-next-line jsx-a11y/no-onchange
    <select className={styles.layoutControl} onChange={handler}>
      <option value={1}>
        1&times;12
      </option>
      <option value={2}>
        2&times;6
      </option>
      <option value={3}>
        3&times;4
      </option>
      <option value={4}>
        4&times;3
      </option>
      <option value={6}>
        6&times;2
      </option>
      <option value={12}>
        12&times;1
      </option>
    </select>
  );
}

LayoutControl.propTypes = {
  handler: PropTypes.func.isRequired
};

function Row({ slots, id }) {
  const appDispatch = useAppDispatch();
  const [hotbarLayout, setHotbarLayout] = useState();

  function handleLayoutControl(e) {
    const { value } = e.currentTarget;
    setHotbarLayout(value);
    appDispatch({
      type: 'updateHotbarLayout',
      hbId: id,
      hbConfig: value
    });
  }

  return (
    <>
      <ol className={styles.row} data-rows={hotbarLayout}>
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

      <LayoutControl handler={(e) => handleLayoutControl(e)} />
    </>
  );
}

Row.propTypes = {
  slots: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export function Hotbar() {
  const { hotbar } = useAppState();

  return (
    <ol className={styles.container}>
      {Object.keys(hotbar).map((barKey) => (
        <li key={barKey} className={styles.rowWrapper}>
          <Row slots={hotbar[barKey]} id={barKey} />
        </li>
      ))}
    </ol>
  );
}

export default Hotbar;
