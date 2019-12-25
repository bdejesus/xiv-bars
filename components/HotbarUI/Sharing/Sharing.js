import React, { createRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useXIVBarsState } from '~/XIVBars/context';

import styles from './styles.scss';

function Sharing() {
  const router = useRouter();
  const XIVBarsState = useXIVBarsState();
  const [copied, setCopied] = useState(false);
  const slotsQuery = (/\d/).test(XIVBarsState.encodedSlots) ? XIVBarsState.encodedSlots : '';
  const query = { ...router.query, s: slotsQuery };
  const queryString = Object.keys(query)
    .filter((key) => query[key] !== '')
    .map((key) => `${key}=${query[key]}`)
    .join('&');
  const urlInput = createRef();

  function copyUrl() {
    urlInput.current.focus();
    urlInput.current.select();
    document.execCommand('copy');
    setCopied(true);
    setTimeout(() => { setCopied(false); }, 3000);
  }

  return (
    <div className={styles.container} data-copied={copied}>
      <input
        className={styles.shareUrlInput}
        type="text"
        value={`https://xivbars.josebenedicto.com?${queryString}`}
        ref={urlInput}
        readOnly
      />
      <button
        type="button"
        className="button"
        onClick={copyUrl}
      >
      Copy Share URL
      </button>
    </div>
  );
}

export default Sharing;
