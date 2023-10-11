/* eslint-disable jsx-a11y/no-onchange */
import { useAppState, useAppDispatch } from 'components/App/context';
import Options from './Options';
import styles from './Settings.module.scss';

function Settings() {
  const { wxhb, xhb, exhb } = useAppState();
  const appDispatch = useAppDispatch();

  function handleSelect(id: string, event: React.ChangeEvent<HTMLSelectElement>) {
    const { value } = event.currentTarget;
    const targetValue = parseInt(value, 10);
    appDispatch({ type: 'updateUI', payload: { [id]: targetValue } });
  }

  return (
    <div className={styles.xhbControls}>
      <div className={styles.xhbControl}>
        <Options
          id="xhb"
          onChange={(event) => handleSelect('xhb', event)}
          value={xhb.toString()}
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
          onChange={(event) => handleSelect('wxhb', event)}
          value={wxhb.toString()}
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
          onChange={(event) => handleSelect('exhb', event)}
          value={exhb.toString()}
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
