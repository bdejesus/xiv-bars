/* eslint-disable jsx-a11y/no-onchange */
import { useAppState, useAppDispatch } from 'components/App/context';
import Options from './Options';
import styles from './Settings.module.scss';

function Settings() {
  const { wxhb, xhb, exhb } = useAppState();
  const appDispatch = useAppDispatch();

  function handleSelect(id, value) {
    const targetValue = parseInt(value, 10);
    appDispatch({ type: 'updateUI', params: { [id]: targetValue } });
  }

  return (
    <div className={styles.xhbControls}>
      <div className={styles.xhbControl}>
        <Options
          id="xhb"
          onChange={({ currentTarget }) => handleSelect('xhb', currentTarget.value)}
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
          onChange={({ currentTarget }) => handleSelect('wxhb', currentTarget.value)}
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
          onChange={({ currentTarget }) => handleSelect('exhb', currentTarget.value)}
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
