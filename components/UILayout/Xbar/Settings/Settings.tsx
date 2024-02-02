/* eslint-disable jsx-a11y/no-onchange */
import React from 'react';
import { useRouter } from 'next/router';
import { buildShareUrl } from 'lib/utils/url';
import { useAppState } from 'components/App/context';
import Options from './Options';
import styles from './Settings.module.scss';

function Settings() {
  const router = useRouter();
  const { viewData, selectedJob } = useAppState();
  const { xhb, wxhb, exhb } = viewData;

  function handleSelect(id: string, event: React.ChangeEvent<HTMLSelectElement>) {
    if (selectedJob) {
      const { value } = event.currentTarget;
      const url = buildShareUrl({ ...router.query, [id]: value });
      router.push(url, undefined, { shallow: true });
    }
  }

  return (
    <div className={styles.xhbControls}>
      <div className={styles.xhbControl}>
        <Options
          id="xhb"
          onChange={(event) => handleSelect('xhb', event)}
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
          onChange={(event) => handleSelect('wxhb', event)}
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
          onChange={(event) => handleSelect('exhb', event)}
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
