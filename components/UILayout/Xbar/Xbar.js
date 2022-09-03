/* eslint-disable jsx-a11y/no-onchange */
/* eslint-disable react/prefer-stateless-function */
import { useState } from 'react';
import PropTypes from 'prop-types';
import { group } from 'lib/utils';
import Slot from 'components/Slot';
import { useAppState } from 'components/App/context';
import styles from './Xbar.module.scss';

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
  slots: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

function Bar({ bar }) {
  const barGroups = {
    left: bar.slice(0, 8),
    right: bar.slice(8, bar.length + 1)
  };

  return (
    <>
      {Object.keys(barGroups).map((slots, index) => (
        <div className={`${styles[slots]} ${slots}`} key={`group-${index}`}>
          <Group slots={barGroups[slots]} />
        </div>
      ))}
    </>
  );
}

Bar.propTypes = {
  bar: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export function Xbar() {
  const { chotbar } = useAppState();
  const [WXHB, setWXHB] = useState();
  const [mainXHB, setMainXHB] = useState('one');

  function handleSelectMainXHB(e) {
    const { value } = e.currentTarget;
    if (value === WXHB) setWXHB('undefined');
    setMainXHB(value);
  }

  function handleSelectWXHB(e) {
    const { value } = e.currentTarget;

    if (value === mainXHB) {
      const keys = Object.keys(chotbar);
      const keyIndex = keys.indexOf(value);
      const nextIndex = keyIndex + 1 >= keys.length ? 0 : keyIndex + 1;
      setMainXHB(keys[nextIndex]);
    }

    setWXHB(value);
  }

  return (
    <>
      <div className={styles.xhbControls}>
        <div className={styles.xhbControl}>
          <label htmlFor="mainXHB">
            <span className={styles.controlLabel}>
              Main XHB
            </span>
            <select
              id="mainXHB"
              name="mainXHB"
              onChange={handleSelectMainXHB}
              value={mainXHB}
            >
              { Object.keys(chotbar).map((key, index) => (
                <option value={key} key={key}>
                  {index + 1}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles.xhbControl}>
          <label htmlFor="wxhbOptions">
            <span className={styles.controlLabel}>
              WXHB
            </span>
            <select
              id="wxhbOptions"
              name="wxhbOptions"
              onChange={handleSelectWXHB}
              value={WXHB}
            >
              <option value="undefined">Off</option>
              { Object.keys(chotbar).map((key, index) => (
                <option value={key} key={key}>
                  {index + 1}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className={styles.container}>

        {Object.keys(chotbar).map((xbar) => (
          <div
            className={[styles.xbar, styles[xbar]].join(' ')}
            key={xbar}
            data-main={xbar === mainXHB}
            data-wxhb={xbar === WXHB}
          >
            <Bar bar={chotbar[xbar]} id={xbar} />
          </div>
        ))}
      </div>
    </>
  );
}

export default Xbar;
