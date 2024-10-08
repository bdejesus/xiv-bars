/* eslint-disable jsx-a11y/no-onchange */
import React from 'react';
import { useRouter } from 'next/router';
import { buildUrl } from 'lib/utils/url';
import { useAppState, useAppDispatch } from 'components/App/context';
import { appActions } from 'components/App/actions';
import Options from './Options';
import styles from './LayoutControl.module.scss';

export default function LayoutControl({ show }:{ show: boolean }) {
  const router = useRouter();
  const appDispatch = useAppDispatch();
  const { viewData, selectedJob } = useAppState();
  const { xhb, wxhb, exhb } = viewData;

  function handleSelect(id: string, event: React.ChangeEvent<HTMLSelectElement>) {
    if (selectedJob) {
      const { value } = event.currentTarget;
      const url = buildUrl({ query: router.query, mergeData: { [id]: value } });
      appDispatch({
        type: appActions.SET_STATE,
        payload: {
          viewData: {
            ...viewData,
            [id]: value ? parseInt(value, 10) : null
          }
        }
      });
      if (!viewData.id) router.push(url, undefined, { shallow: true });
    }
  }

  return (
    <div className={styles.xhbControls} data-active={show}>
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
