/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import { createRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useAppState } from 'components/App/context';
import host from 'lib/host';
import styles from './Sharing.module.scss';

export function Sharing({ selectedJob }) {
  const router = useRouter();
  const { encodedSlots } = useAppState();
  const [copied, setCopied] = useState(false);

  const urlInput = createRef();

  useEffect(() => {
    function buildShareUrl() {
      const slots = (/\d/).test(encodedSlots) ? encodedSlots : '';
      const query = { s1: slots };
      if (typeof router.query.l !== 'undefined') query.l = router.query.l;

      const queryString = Object.keys(query)
        .filter((key) => query[key] !== '')
        .map((key) => `${key}=${query[key]}`)
        .join('&');

      return `${host.host}/job/${selectedJob.Abbr}?${queryString}`;
    }

    const shareURL = buildShareUrl();
    urlInput.current.value = shareURL;
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
        <img src="/images/icon-copy.svg" className="btn-icon" alt="Copy Icon" />
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
