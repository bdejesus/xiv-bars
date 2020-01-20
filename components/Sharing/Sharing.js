import React, { createRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useXIVBarsState } from '~/XIVBars/context';

import styles from './styles.scss';

function Sharing() {
  const router = useRouter();
  const XIVBarsState = useXIVBarsState();
  const [copied, setCopied] = useState(false);
  const urlInput = createRef();
  const slotsQuery = (/\d/).test(XIVBarsState.encodedSlots) ? XIVBarsState.encodedSlots : '';
  const query = { ...router.query, s: slotsQuery };
  const queryString = Object.keys(query)
    .filter((key) => query[key] !== '')
    .map((key) => `${key}=${query[key]}`)
    .join('&');

  useEffect(() => {
    console.log(XIVBarsState);
  });

  function selectInput() {
    console.log(XIVBarsState);
    urlInput.current.focus();
    urlInput.current.select();
  }

  function copyUrl() {
    selectInput();
    document.execCommand('copy');
    setCopied(true);
    setTimeout(() => { setCopied(false); }, 3000);
  }

  return (
    <div className={`${styles.container}`} data-copied={copied}>
      <div className="controlGroup">
        <label htmlFor="shareUrl">Share URL</label>
        <input
          id="shareUrl"
          className={styles.shareUrlInput}
          type="text"
          value={`https://xivbars.josebenedicto.com?${queryString}`}
          ref={urlInput}
          onClick={selectInput}
          readOnly
        />
      </div>
      <button
        type="button"
        className="button"
        onClick={copyUrl}
      >
      Copy URL
      </button>
    </div>
  );
}

export default Sharing;
