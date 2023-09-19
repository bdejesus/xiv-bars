import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Slot from 'components/Slot';
import { useAppState, useAppDispatch } from 'components/App/context';
import { hotbarKeyPos, hasActions } from 'lib/xbars';
import styles from './Hotbar.module.scss';

function LayoutControl({ handler, defaultValue }) {
  return (
    // eslint-disable-next-line jsx-a11y/no-onchange
    <select className={styles.layoutControl} onChange={handler} defaultValue={defaultValue}>
      <option value={1}>
        12&times;1
      </option>
      <option value={2}>
        6&times;2
      </option>
      <option value={3}>
        4&times;3
      </option>
      <option value={4}>
        3&times;4
      </option>
      <option value={6}>
        2&times;6
      </option>
      <option value={12}>
        1&times;12
      </option>
    </select>
  );
}

LayoutControl.propTypes = {
  handler: PropTypes.func.isRequired,
  defaultValue: PropTypes.number
};

LayoutControl.defaultProps = {
  defaultValue: 1
};

function Row({ slots, id }) {
  const appDispatch = useAppDispatch();
  const { readOnly, hb } = useAppState();
  const [hotbarLayout, setHotbarLayout] = useState();
  const defaultValue = parseInt(hb[hotbarKeyPos(id)], 10);

  function handleLayoutControl(e) {
    const { value } = e.currentTarget;
    setHotbarLayout(value);
    appDispatch({
      type: 'updateHotbarLayout',
      hbId: id,
      hbConfig: value
    });
  }

  useEffect(() => {
    setHotbarLayout(defaultValue);
  }, []);

  return (
    <>
      <ol className={styles.row} data-columns={hotbarLayout}>
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

      { !readOnly && (
        <LayoutControl
          handler={(e) => handleLayoutControl(e)}
          defaultValue={defaultValue}
        />
      )}
    </>
  );
}

Row.propTypes = {
  slots: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  id: PropTypes.string.isRequired
};

export function Hotbar() {
  const { hotbar, readOnly } = useAppState();

  return (
    <ol className={styles.container}>
      {Object.keys(hotbar).map((barKey) => (
        <li key={barKey} className={styles.rowWrapper}>
          { (!readOnly || hasActions(hotbar[barKey])) && <Row slots={hotbar[barKey]} id={barKey} /> }
        </li>
      ))}
    </ol>
  );
}

export default Hotbar;
