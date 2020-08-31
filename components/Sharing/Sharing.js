/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React, { createRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useAppState } from 'components/App/context';

import styles from './Sharing.styles.module.scss';

function Sharing({ selectedJob }) {
  const router = useRouter();
  const { encodedSlots, host } = useAppState();
  const [copied, setCopied] = useState(false);

  const urlInput = createRef();

  function buildShareUrl() {
    const slots = (/\d/).test(encodedSlots) ? encodedSlots : '';
    const query = { s: slots };
    if (typeof router.query.l !== 'undefined') query.l = router.query.l;

    const queryString = Object.keys(query)
      .filter((key) => query[key] !== '')
      .map((key) => `${key}=${query[key]}`)
      .join('&');

    return `${host}/job/${selectedJob.Abbr}?${queryString}`;
  }

  useEffect(() => {
    const shareUrl = buildShareUrl();
    urlInput.current.value = shareUrl;
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
        <label htmlFor="shareUrl">Share URL</label>
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
        Copy URL
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
