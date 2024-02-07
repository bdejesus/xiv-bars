/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import { createRef, useEffect, useState } from 'react';
import { buildUrl } from 'lib/utils/url';
import { useRouter } from 'next/router';
import { useAppState } from 'components/App/context';
import Icon, { Icons } from 'components/Icon';
import { domain } from 'lib/host';
import I18n from 'lib/I18n/locale/en-US';

import styles from './Sharing.module.scss';

export function Sharing() {
  const router = useRouter();
  const { viewAction } = useAppState();
  const [shareURL, setShareURL] = useState(domain);
  const [copied, setCopied] = useState(false);
  const urlInput = createRef<HTMLInputElement>();

  function getLayoutUrl(jobId?:string, params?:string[]) {
    const [layoutId] = params || [];
    return `${domain}/job/${jobId}/${layoutId}`;
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
  }

  useEffect(() => {
    const [layoutId] = router.query.params || [];
    const urlString = (viewAction === 'show' && layoutId)
      ? getLayoutUrl(router.query.jobId as string, router.query.params as string[])
      : buildUrl({ query: router.query });
    setShareURL(urlString);
  }, [viewAction, router.query]);

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
