/* eslint-disable jsx-a11y/no-onchange */
/* eslint-disable react/prefer-stateless-function */
import { useState } from 'react';
import { useAppState, useAppDispatch } from 'components/App/context';
import Bar from './Bar';
import styles from './Xbar.module.scss';

export function Xbar() {
  const { chotbar } = useAppState();
  const [wxhb, setWxhb] = useState();
  const [mainXhb, setMainXhb] = useState('one');
  const appDispatch = useAppDispatch();

  function handleSelectMainXHB(e) {
    const { value } = e.currentTarget;
    if (value === wxhb) setWxhb('undefined');
    setMainXhb(value);
    appDispatch({ type: 'updateLayout', mainXhb: value, wxhb });
  }

  function handleSelectWXHB(e) {
    const { value } = e.currentTarget;

    if (value === mainXhb) {
      const keys = Object.keys(chotbar);
      const keyIndex = keys.indexOf(value);
      const nextIndex = keyIndex + 1 >= keys.length ? 0 : keyIndex + 1;
      setMainXhb(keys[nextIndex]);
    }

    setWxhb(value);
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
              value={mainXhb}
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
              value={wxhb}
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
            data-main={xbar === mainXhb}
            data-wxhb={xbar === wxhb}
          >
            <Bar bar={chotbar[xbar]} id={xbar} />
          </div>
        ))}
      </div>
    </>
  );
}

export default Xbar;
