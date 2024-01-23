/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import { createRef, useEffect, useState } from 'react';
import { jsonToQuery } from 'lib/utils/url';
import { useRouter } from 'next/router';
import { useAppState } from 'components/App/context';
import Icon from 'components/Icon';
import { domain } from 'lib/host';
import I18n from 'lib/I18n/locale/en-US';

import styles from './Sharing.module.scss';

export function Sharing() {
  const router = useRouter();

  const {
    readOnly,
    viewAction,
    hb,
    selectedJob
  } = useAppState();
  const [shareURL, setShareURL] = useState(domain);
  const [copied, setCopied] = useState(false);
  const urlInput = createRef<HTMLInputElement>();

  function buildShareUrl() {
    const {
      s1, xhb, wxhb, exhb, l
    } = router.query;

    const query = {
      s1,
      xhb: xhb || 1,
      wxhb: wxhb || 0,
      exhb: exhb || 0,
      hb,
      l: l || 0
    };

    const queryString = jsonToQuery(query);
    return `${domain}/job/${selectedJob.Abbr}/new?${queryString}`;
  }

  function getLayoutUrl() {
    const layoutId: string | string[] | undefined = router.query.params;
    return `${domain}/job/${selectedJob.Abbr}/${layoutId}`;
  }

  function selectInput() {
    urlInput.current?.focus();
    urlInput.current?.select();
  }

  function copyUrl() {
    selectInput();
    document.execCommand('copy');
    urlInput.current?.blur();
    setCopied(true);
    setTimeout(() => { setCopied(false); }, 3000);
    if (viewAction === 'new') {
      router.push(shareURL, undefined, { shallow: true });
    }
  }

  useEffect(() => {
    const urlString = readOnly ? getLayoutUrl() : buildShareUrl();
    setShareURL(urlString);
  }, [router.query]);

  return (
    <div className={`${styles.container}`} data-copied={copied}>
      <div className="controlGroup">
        <label htmlFor="shareUrl">
          {I18n.Sharing.share_url}
        </label>

        <input
          id="shareUrl"
          className={styles.shareUrlInput}
          type="text"
          ref={urlInput}
          onClick={selectInput}
          value={shareURL}
          readOnly
        />
      </div>

      <button
        type="button"
        className={`${styles.copyButton} button btn-icon`}
        onClick={copyUrl}
        title={I18n.Sharing.share_url}
      >
        <Icon id="link" title={I18n.Sharing.share_url} />
      </button>
    </div>
  );
}

export default Sharing;
