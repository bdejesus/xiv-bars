/* eslint-disable jsx-a11y/no-onchange */
/* eslint-disable react/prefer-stateless-function */
import { useAppState, useAppDispatch } from 'components/App/context';
import Bar from './Bar';
import styles from './Xbar.module.scss';

export function Xbar() {
  const { chotbar, wxhb, xhb } = useAppState();
  const appDispatch = useAppDispatch();

  function handleSelectMainXHB(e) {
    const targetXhb = parseInt(e.currentTarget.value, 10);
    appDispatch({
      type: 'updateUI',
      params: {
        xhb: targetXhb,
        wxhb: (targetXhb === wxhb) ? 0 : wxhb
      }
    });
  }

  function handleSelectWXHB(e) {
    const targetWxhb = parseInt(e.currentTarget.value, 10);
    if (targetWxhb === xhb) {
      const keys = Object.keys(chotbar);
      const nextIndex = chotbar[targetWxhb + 1] >= keys.length ? 0 : targetWxhb + 1;
      appDispatch({
        type: 'updateUI',
        params: { xhb: nextIndex, wxhb: targetWxhb }
      });
    } else {
      appDispatch({
        type: 'updateUI',
        params: { xhb, wxhb: targetWxhb }
      });
    }
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
              value={xhb}
            >
              { Object.keys(chotbar).map((key, index) => (
                <option value={index + 1} key={key}>
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
              <option value={0}>Off</option>
              { Object.keys(chotbar).map((key, index) => (
                <option value={index + 1} key={key}>
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
            data-main={xbar === Object.keys(chotbar)[xhb - 1]}
            data-wxhb={xbar === Object.keys(chotbar)[wxhb - 1]}
          >
            <Bar bar={chotbar[xbar]} id={xbar} />
          </div>
        ))}
      </div>
    </>
  );
}

export default Xbar;
