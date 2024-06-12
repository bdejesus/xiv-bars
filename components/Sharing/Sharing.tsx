/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import { useTranslation } from 'next-i18next';
import { createRef, useEffect, useState } from 'react';
import { buildUrl } from 'lib/utils/url';
import { useRouter } from 'next/router';
import { useAppState } from 'components/App/context';
import Icon, { Icons } from 'components/Icon';
import { domain } from 'lib/host';

import styles from './Sharing.module.scss';

export function Sharing() {
  const { t } = useTranslation();
  const router = useRouter();
  const { viewAction } = useAppState();
  const [shareURL, setShareURL] = useState(domain);
  const [copied, setCopied] = useState(false);
  const urlInput = createRef<HTMLInputElement>();

  function selectInput() {
    urlInput.current?.focus();
    urlInput.current?.select();
  }

  function handleClick() {
    selectInput();
    document.execCommand('copy');
    urlInput.current?.blur();
    setCopied(true);
    setTimeout(() => { setCopied(false); }, 3000);
  }

  useEffect(() => {
    const urlString = (viewAction === 'show' && router.query.layoutId)
      ? `${domain}/job/${router.query.jobId}/${router.query.layoutId}`
      : buildUrl({ query: router.query });
    setShareURL(urlString);
  }, [viewAction, router.query]);

  return (
    <div className={`${styles.container}`} data-copied={copied}>
      <div className="controlGroup">
        <label htmlFor="shareUrl">
          {t('Sharing.share_url')}
        </label>

        <input
          id="shareUrl"
          type="text"
          ref={urlInput}
          onClick={selectInput}
          value={shareURL}
          readOnly
        />
      </div>

      <button
        type="button"
        className="button btn-icon"
        onClick={handleClick}
        data-title={copied ? t('Sharing.url_copied') : t('Sharing.copy_url')}
      >
        <Icon id={Icons.LINK} alt={t('Sharing.share_url')} />
        <span className="btn-label-hidden">{t('Sharing.share_url')}</span>
      </button>
    </div>
  );
}

export default Sharing;
