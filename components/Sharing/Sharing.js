/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import { createRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useAppState } from 'components/App/context';
import { domain } from 'lib/host';
import styles from './Sharing.module.scss';

export function Sharing({ selectedJob }) {
  const router = useRouter();
  const { encodedSlots, readOnly, viewAction } = useAppState();
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

      return `${domain}/job/${selectedJob.Abbr}?${queryString}`;
    }

    function getLayoutUrl() {
      const [layoutId] = router.query.params;
      return `${domain}/job/${selectedJob.Abbr}/${layoutId}`;
    }

    const shareURL = readOnly ? getLayoutUrl() : buildShareUrl();
    urlInput.current.value = shareURL;

    if (viewAction === 'new') {
      router.push(shareURL, undefined, { shallow: true });
    }
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
