/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React, { createRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAppState } from 'components/App/context';

import styles from './Sharing.module.scss';

function Sharing({ selectedJob }) {
  const router = useRouter();
  const { encodedSlots, host } = useAppState();
  const [copied, setCopied] = useState(false);

  const urlInput = createRef();

  function buildShareUrl() {
    const slots = (/\d/).test(encodedSlots) ? encodedSlots : '';
    const query = { s1: slots };
    if (typeof router.query.l !== 'undefined') query.l = router.query.l;

    const queryString = Object.keys(query)
      .filter((key) => query[key] !== '')
      .map((key) => `${key}=${query[key]}`)
      .join('&');

    console.log(host);

    return `${host}/job/${selectedJob.Abbr}?${queryString}`;
  }

  useEffect(() => {
    urlInput.current.value = buildShareUrl();
  }, [encodedSlots]);

  function selectInput() {
    urlInput.current.focus();
    urlInput.current.select();
  }

  function copyUrl() {
    selectInput();
    document.execCommand('copy');
    urlInput.current.blur();
    setCopied(true);
    setTimeout(() => { setCopied(false); }, 3000);
  }

  return (
    <div className={`${styles.container}`} data-copied={copied}>
      <div className="controlGroup">
        <label htmlFor="shareUrl">
          { copied ? 'Copied!' : 'Share URL' }
        </label>
        <input
          id="shareUrl"
          className={styles.shareUrlInput}
          type="text"
          ref={urlInput}
          onClick={selectInput}
          readOnly
        />
      </div>
      <button
        type="button"
        className={styles.copyButton}
        onClick={copyUrl}
      >
        <Image
          src="/images/icon-copy.svg"
          className="icon"
          alt="Copy Icon"
          height={24}
          width={24}
        />
        Copy
      </button>
    </div>
  );
}

Sharing.propTypes = {
  selectedJob: PropTypes.shape()
};

Sharing.defaultProps = {
  selectedJob: undefined
};

export default Sharing;
