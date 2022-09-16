/* eslint-disable jsx-a11y/no-onchange */
/* eslint-disable react/prefer-stateless-function */
import { useAppState, useAppDispatch } from 'components/App/context';
import Bar from './Bar';
import styles from './Xbar.module.scss';

export function Xbar() {
  const {
    chotbar, wxhb, xhb, exhb, viewData, readOnly
  } = useAppState();
  const hbKeys = Object.keys(chotbar);
  const appDispatch = useAppDispatch();

  function handleSelectMainXHB(e) {
    const targetXhb = parseInt(e.currentTarget.value, 10);
    appDispatch({ type: 'updateUI', params: { xhb: targetXhb } });
  }

  function handleSelectWXHB(e) {
    const targetWxhb = parseInt(e.currentTarget.value, 10);
    appDispatch({ type: 'updateUI', params: { wxhb: targetWxhb } });
  }

  function handleSelectEXHB(e) {
    const targetExhb = parseInt(e.currentTarget.value, 10);
    appDispatch({ type: 'updateUI', params: { exhb: targetExhb } });
  }

  return (
    <>
      { !(viewData && readOnly) && (
      <div className={styles.xhbControls}>
        <div className={styles.xhbControl}>
          <label htmlFor="mainXHB">
            <span className={styles.controlLabel}>
              Main XHB
              <br />

              <span className={styles.controlGuide}>
                <b className={styles.lt}>LT</b>
              </span>

              <span className={styles.controlGuide}>
                <b className={styles.rt}>RT</b>
              </span>
            </span>

            <select
              id="mainXHB"
              name="mainXHB"
              onChange={handleSelectMainXHB}
              value={xhb}
            >
              { hbKeys.map((key, index) => {
                const value = index + 1;
                return (
                  <option
                    value={value}
                    key={key}
                    disabled={value === wxhb || value === exhb}
                  >
                    {value}
                  </option>
                );
              })}
            </select>
          </label>
        </div>

        <div className={styles.xhbControl}>
          <label htmlFor="wxhbOptions">
            <span className={styles.controlLabel}>
              WXHB
              <br />

              <span className={styles.controlGuide}>
                <b className={styles.lt}>LT</b> <b className={styles.lt}>LT</b>
              </span>
              <span className={styles.controlGuide}>
                <b className={styles.rt}>RT</b> <b className={styles.rt}>RT</b>
              </span>
            </span>

            <select
              id="wxhbOptions"
              name="wxhbOptions"
              onChange={handleSelectWXHB}
              value={wxhb}
            >
              <option value={0}>Off</option>
              { hbKeys.map((key, index) => {
                const value = index + 1;
                return (
                  <option
                    value={value}
                    key={key}
                    disabled={value === xhb || value === exhb}
                  >
                    {value}
                  </option>
                );
              })}
            </select>
          </label>
        </div>

        <div className={styles.xhbControl}>
          <label htmlFor="exhbOptions">
            <span className={styles.controlLabel}>
              Expanded XHB
              <br />

              <span className={styles.controlGuide}>
                <b className={styles.lt}>LT</b>&rarr;<b className={styles.rt}>RT</b>
              </span>
              <span className={styles.controlGuide}>
                <b className={styles.rt}>RT</b>&rarr;<b className={styles.lt}>LT</b>
              </span>
            </span>

            <select
              id="exhbOptions"
              name="exhbOptions"
              onChange={handleSelectEXHB}
              value={exhb}
            >
              <option value={0}>Off</option>
              { hbKeys.map((key, index) => {
                const value = index + 1;
                return (
                  <option
                    value={value}
                    key={key}
                    disabled={value === wxhb || value === xhb}
                  >
                    {value}
                  </option>
                );
              })}
            </select>
          </label>
        </div>
      </div>
      )}

      <div className={styles.container}>
        {hbKeys.map((xbar) => (
          <div
            key={xbar}
            className={[styles.xbar, styles[xbar]].join(' ')}
            data-main={xbar === hbKeys[xhb - 1]}
            data-wxhb={xbar === hbKeys[wxhb - 1]}
            data-exhb={xbar === hbKeys[exhb - 1]}
          >
            <Bar bar={chotbar[xbar]} id={xbar} />
          </div>
        ))}
      </div>
    </>
  );
}

export default Xbar;
