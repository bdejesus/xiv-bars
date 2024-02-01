/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import { createRef, useEffect, useState } from 'react';
import { jsonToQuery } from 'lib/utils/url';
import { useRouter } from 'next/router';
import { useAppState } from 'components/App/context';
import { defaultState } from 'components/App/defaultState';
import Icon, { Icons } from 'components/Icon';
import { domain } from 'lib/host';
import I18n from 'lib/I18n/locale/en-US';

import styles from './Sharing.module.scss';

export function Sharing() {
  const router = useRouter();
  const {
    readOnly,
    viewAction,
    viewData,
    selectedJob
  } = useAppState();
  const { hb } = viewData;
  const [shareURL, setShareURL] = useState(domain);
  const [copied, setCopied] = useState(false);
  const urlInput = createRef<HTMLInputElement>();

  function buildShareUrl() {
    const query = {
      s1: router.query.s1,
      xhb: router.query.xhb || defaultState.viewData.xhb,
      wxhb: router.query.wxhb || defaultState.viewData.wxhb,
      exhb: router.query.exhb || defaultState.viewData.exhb,
      hb,
      l: router.query.l || 0
    };

    const queryString = jsonToQuery(query);
    return `${domain}/job/${selectedJob?.Abbr}/new?${queryString}`;
  }

  function getLayoutUrl() {
    const layoutId: string | string[] | undefined = router.query.params;
    return `${domain}/job/${selectedJob?.Abbr}/${layoutId}`;
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
    const urlString = (readOnly && selectedJob) ? getLayoutUrl() : buildShareUrl();
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
        data-title={copied ? I18n.Sharing.url_copied : I18n.Sharing.share_url}
        data-title-anchor="left"
      >
        <Icon id={Icons.LINK} alt={I18n.Sharing.share_url} />
        <span className="btn-label-hidden">{I18n.Sharing.share_url}</span>
      </button>
    </div>
  );
}

export default Sharing;
