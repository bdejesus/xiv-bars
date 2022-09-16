/* eslint-disable jsx-a11y/no-onchange */
import { useAppState, useAppDispatch } from 'components/App/context';
import Options from './Options';
import styles from './Settings.module.scss';

function Settings() {
  const { wxhb, xhb, exhb } = useAppState();
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
    <div className={styles.xhbControls}>
      <div className={styles.xhbControl}>
        <Options
          id="xhb"
          onChange={(e) => handleSelectMainXHB(e)}
          value={xhb}
          required
        >
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
        </Options>
      </div>

      <div className={styles.xhbControl}>
        <Options
          id="wxhb"
          onChange={(e) => handleSelectWXHB(e)}
          value={wxhb}
        >
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
        </Options>
      </div>

      <div className={styles.xhbControl}>
        <Options
          id="exhb"
          onChange={(e) => handleSelectEXHB(e)}
          value={exhb}
        >
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
        </Options>
      </div>
    </div>
  );
}

export default Settings;
